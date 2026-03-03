"""Tender Award Intelligence router.

Endpoints:
  POST /api/v1/tenders                      – Ingest a tender award
  GET  /api/v1/tenders                      – List tender awards (filterable by company)
  GET  /api/v1/tenders/{id}                 – Get a single tender award
  DELETE /api/v1/tenders/{id}               – Delete a tender award
  GET  /api/v1/tenders/score/cpi            – Compute CPI for a company
  POST /api/v1/tenders/score/win            – Compute Win Probability Score
  POST /api/v1/tenders/score/relationship   – Compute Relationship Timing Score
  POST /api/v1/tenders/ai/analyze           – AI tender award analysis (Worker 2)
  POST /api/v1/tenders/ai/pricing           – Competitive pricing model (Workers 3 + math)
"""

import json
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.tender import TenderAward
from backend.schemas.tender import (
    CPIRequest,
    CPIResult,
    RelationshipSuggestRequest,
    RelationshipSuggestResult,
    TenderAwardCreate,
    TenderAwardRead,
    WinScoreRequest,
    WinScoreResult,
)
from backend.services.ai_workers import CompetitivePricingWorker, TenderAwardWorker
from backend.services import math_service
from backend.services import scoring
from backend.services.scoring import _cpi_norm
from backend.services.relationship import generate_contact_brief

logger = logging.getLogger("contractghost.tender")

router = APIRouter(prefix="/tenders", tags=["Tender Intelligence"])


def _load_list(value: str | None) -> list[str] | None:
    """Parse a JSON-encoded list string back to a Python list."""
    if value is None:
        return None
    try:
        parsed = json.loads(value)
        if isinstance(parsed, list):
            return [str(i) for i in parsed]
    except (json.JSONDecodeError, TypeError):
        pass
    return [value] if value else None


def _dump_list(value: list[str] | None) -> str | None:
    """Serialise a list to JSON string for storage."""
    if value is None:
        return None
    return json.dumps(value)


def _award_to_read(award: TenderAward) -> TenderAwardRead:
    """Convert ORM object to Pydantic schema, deserialising JSON list fields."""
    data = {
        "id": award.id,
        "authority_name": award.authority_name,
        "winning_company": award.winning_company,
        "contract_value": float(award.contract_value) if award.contract_value is not None else None,
        "contract_currency": award.contract_currency,
        "scope_summary": award.scope_summary,
        "cpv_codes": _load_list(award.cpv_codes),
        "award_date": award.award_date,
        "duration_months": award.duration_months,
        "source_url": award.source_url,
        "framework": award.framework,
        "region": award.region,
        "competitors": _load_list(award.competitors),
        "mw_capacity": award.mw_capacity,
        "created_at": award.created_at,
    }
    return TenderAwardRead(**data)


# ── CRUD ──────────────────────────────────────────────────────────────────────

@router.post(
    "",
    response_model=TenderAwardRead,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest a tender award record",
)
def create_tender_award(payload: TenderAwardCreate, db: Session = Depends(get_db)):
    obj = TenderAward(
        authority_name=payload.authority_name,
        winning_company=payload.winning_company,
        contract_value=payload.contract_value,
        contract_currency=payload.contract_currency,
        scope_summary=payload.scope_summary,
        cpv_codes=_dump_list(payload.cpv_codes),
        award_date=payload.award_date,
        duration_months=payload.duration_months,
        source_url=payload.source_url,
        framework=payload.framework,
        region=payload.region,
        competitors=_dump_list(payload.competitors),
        mw_capacity=payload.mw_capacity,
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return _award_to_read(obj)


@router.get(
    "",
    response_model=list[TenderAwardRead],
    summary="List tender award records",
)
def list_tender_awards(
    company: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """Return tender awards, optionally filtered by winning company name."""
    q = db.query(TenderAward).order_by(TenderAward.created_at.desc())
    if company:
        q = q.filter(TenderAward.winning_company.ilike(f"%{company}%"))
    return [_award_to_read(a) for a in q.offset(skip).limit(limit).all()]


@router.get(
    "/{award_id}",
    response_model=TenderAwardRead,
    summary="Get a single tender award",
)
def get_tender_award(award_id: int, db: Session = Depends(get_db)):
    obj = db.get(TenderAward, award_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Tender award not found")
    return _award_to_read(obj)


@router.delete(
    "/{award_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a tender award record",
)
def delete_tender_award(award_id: int, db: Session = Depends(get_db)):
    obj = db.get(TenderAward, award_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Tender award not found")
    db.delete(obj)
    db.commit()


# ── Scoring Endpoints ─────────────────────────────────────────────────────────

@router.get(
    "/score/cpi",
    response_model=CPIResult,
    summary="Compute Competitive Pricing Index for a company",
)
def get_cpi(
    company: str,
    region_factor: float = 1.0,
    db: Session = Depends(get_db),
):
    """
    Compute the Competitive Pricing Index (CPI) using historical tender awards.

    CPI < 0 → aggressive pricing; CPI > 0 → premium pricing.
    """
    result = scoring.compute_cpi(db, company, region_factor)
    return CPIResult(**result)


@router.post(
    "/score/win",
    response_model=WinScoreResult,
    summary="Compute Win Probability Score",
)
def compute_win_score(payload: WinScoreRequest, db: Session = Depends(get_db)):
    """
    Compute the weighted Win Probability Score for a company.

    WinScore = 0.30W + 0.20(1-|CPI|norm) + 0.20E + 0.15H + 0.15R
    """
    cpi_data = scoring.compute_cpi(db, payload.company, payload.region_factor)
    cpi_val = cpi_data["cpi"]

    win_prob = scoring.compute_win_probability(
        historical_win_rate=payload.historical_win_rate,
        cpi=cpi_val,
        expansion_activity_score=payload.expansion_activity_score,
        hiring_velocity=payload.hiring_velocity,
        risk_score=payload.risk_score,
    )

    breakdown = {
        "historical_win_rate_contribution": round(0.30 * payload.historical_win_rate, 4),
        "cpi_contribution": round(0.20 * _cpi_norm(cpi_val), 4),
        "expansion_contribution": round(0.20 * payload.expansion_activity_score, 4),
        "hiring_contribution": round(0.15 * payload.hiring_velocity, 4),
        "risk_contribution": round(0.15 * payload.risk_score, 4),
    }

    return WinScoreResult(
        company=payload.company,
        win_probability=win_prob,
        cpi=cpi_val,
        breakdown=breakdown,
    )


@router.post(
    "/score/relationship",
    response_model=RelationshipSuggestResult,
    summary="Generate relationship timing recommendation",
)
async def suggest_relationship(
    payload: RelationshipSuggestRequest,
    db: Session = Depends(get_db),
):
    """
    Compute relationship timing score and generate a personalised contact brief.

    Uses exponential signal decay and Grok AI for outreach angle generation.
    """
    timing = scoring.compute_relationship_timing(
        events=payload.recent_events,
        days_since=payload.days_since_events,
    )

    brief = await generate_contact_brief(payload.company_name, payload.recent_events)

    return RelationshipSuggestResult(
        company_name=payload.company_name,
        timing_score=timing["timing_score"],
        recommend_contact=timing["recommend_contact"],
        suggested_angle=brief.get("suggested_angle", ""),
        why_now=brief.get("why_now", ""),
        what_to_mention=brief.get("what_to_mention", ""),
        what_to_avoid=brief.get("what_to_avoid", ""),
        risk_flags=brief.get("risk_flags", ""),
    )


# ── AI Analysis Endpoints (Workers 2 & 3) ────────────────────────────────────

_tender_ai_worker = TenderAwardWorker()
_pricing_ai_worker = CompetitivePricingWorker()


class TenderAnalyzeRequest(BaseModel):
    company: str | None = None
    limit: int = 20


class PricingModelRequest(BaseModel):
    contract_values: list[float]
    mw_capacities: list[float] = []
    regional_factor: float = 1.0
    market_avg: float


@router.post(
    "/ai/analyze",
    summary="AI tender award analysis for a company (Worker 2)",
)
async def ai_analyze_tenders(payload: TenderAnalyzeRequest, db: Session = Depends(get_db)):
    """
    Run Worker 2 (Tender Award Analysis) over recent tender records.

    Identifies pricing position, repeat-win patterns, and anomaly flags.
    """
    q = db.query(TenderAward).order_by(TenderAward.created_at.desc())
    if payload.company:
        q = q.filter(TenderAward.winning_company.ilike(f"%{payload.company}%"))
    records = q.limit(payload.limit).all()

    if not records:
        raise HTTPException(status_code=404, detail="No tender records found for this company")

    tender_data = [
        {
            "authority_name": r.authority_name,
            "winning_company": r.winning_company,
            "contract_value": float(r.contract_value) if r.contract_value else None,
            "contract_currency": r.contract_currency,
            "scope_summary": r.scope_summary,
            "award_date": r.award_date,
            "region": r.region,
            "mw_capacity": r.mw_capacity,
        }
        for r in records
    ]
    return await _tender_ai_worker.run(tender_data=tender_data)


@router.post(
    "/ai/pricing",
    summary="Competitive pricing model with deterministic math (Worker 3 + math_service)",
)
async def ai_pricing_model(payload: PricingModelRequest):
    """
    Run Worker 3 (Competitive Pricing Model) for value extraction, then apply
    deterministic math_service calculations.

    The LLM only extracts values; all arithmetic is performed by math_service.
    """
    if not payload.contract_values:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="contract_values must not be empty",
        )

    ai_result = await _pricing_ai_worker.run(
        contract_values=payload.contract_values,
        mw_capacities=payload.mw_capacities,
        regional_factor=payload.regional_factor,
        market_avg=payload.market_avg,
    )

    # Deterministic math layer (overrides any LLM arithmetic)
    math_layer: dict = {}
    try:
        avg_value = math_service.calculate_average_contract_value(payload.contract_values)
        math_layer["average_contract_value"] = avg_value
        math_layer["normalized_price"] = math_service.normalize_price(avg_value, payload.regional_factor)
        math_layer["competitive_pricing_index"] = math_service.calculate_competitive_pricing_index(
            avg_value, payload.market_avg
        )
        if payload.mw_capacities:
            avg_mw = math_service.calculate_average_contract_value(payload.mw_capacities)
            if avg_mw > 0:
                math_layer["price_per_mw"] = math_service.calculate_price_per_mw(avg_value, avg_mw)
        math_layer["percentile_position"] = math_service.calculate_percentile_position(
            avg_value, payload.contract_values
        )
    except ValueError as exc:
        logger.warning("math_service calculation error: %s", exc)
        math_layer["math_error"] = str(exc)

    ai_result["math_service_results"] = math_layer
    return ai_result
