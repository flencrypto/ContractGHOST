"""CRUD router for Opportunities plus qualification scoring."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.account import Account
from backend.models.opportunity import GoNoGo, Opportunity, QualificationScore
from backend.schemas.opportunity import (
    OpportunityCreate,
    OpportunityRead,
    OpportunityUpdate,
    QualificationScoreCreate,
    QualificationScoreRead,
)

router = APIRouter(prefix="/opportunities", tags=["Opportunities"])


def _compute_qualification(payload: QualificationScoreCreate) -> tuple[float, GoNoGo]:
    """
    Compute overall qualification score and go/no-go recommendation.

    Formula:
        overall = (budget_confidence
                   + route_to_market_clarity
                   + (10 - incumbent_lock_in_risk)
                   + procurement_timeline_realism
                   + technical_fit) / 5

    Decision thresholds:
        >= 7.0  → go
        >= 5.0  → conditional
        < 5.0   → no_go
    """
    overall = (
        payload.budget_confidence
        + payload.route_to_market_clarity
        + (10.0 - payload.incumbent_lock_in_risk)
        + payload.procurement_timeline_realism
        + payload.technical_fit
    ) / 5.0

    if overall >= 7.0:
        decision = GoNoGo.go
    elif overall >= 5.0:
        decision = GoNoGo.conditional
    else:
        decision = GoNoGo.no_go

    return round(overall, 2), decision


# ── Opportunity CRUD ──────────────────────────────────────────────────────────

@router.get("", response_model=list[OpportunityRead])
def list_opportunities(
    account_id: int | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """Return opportunities, optionally filtered by account."""
    q = db.query(Opportunity)
    if account_id is not None:
        q = q.filter(Opportunity.account_id == account_id)
    return q.offset(skip).limit(limit).all()


@router.post("", response_model=OpportunityRead, status_code=status.HTTP_201_CREATED)
def create_opportunity(payload: OpportunityCreate, db: Session = Depends(get_db)):
    """Create a new opportunity."""
    if not db.get(Account, payload.account_id):
        raise HTTPException(status_code=404, detail="Account not found")
    obj = Opportunity(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.get("/{opportunity_id}", response_model=OpportunityRead)
def get_opportunity(opportunity_id: int, db: Session = Depends(get_db)):
    obj = db.get(Opportunity, opportunity_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return obj


@router.patch("/{opportunity_id}", response_model=OpportunityRead)
def update_opportunity(
    opportunity_id: int, payload: OpportunityUpdate, db: Session = Depends(get_db)
):
    obj = db.get(Opportunity, opportunity_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{opportunity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_opportunity(opportunity_id: int, db: Session = Depends(get_db)):
    obj = db.get(Opportunity, opportunity_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    db.delete(obj)
    db.commit()


# ── Qualification ─────────────────────────────────────────────────────────────

@router.post(
    "/{opportunity_id}/qualify",
    response_model=QualificationScoreRead,
    status_code=status.HTTP_201_CREATED,
)
def qualify_opportunity(
    opportunity_id: int,
    payload: QualificationScoreCreate,
    db: Session = Depends(get_db),
):
    """
    Run the go/no-go qualification scoring algorithm and persist the result.

    Returns the new QualificationScore with computed overall_score and go_no_go fields.
    """
    opp = db.get(Opportunity, opportunity_id)
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    overall, decision = _compute_qualification(payload)

    score = QualificationScore(
        opportunity_id=opportunity_id,
        overall_score=overall,
        go_no_go=decision,
        **payload.model_dump(),
    )
    db.add(score)
    db.commit()
    db.refresh(score)
    return score


@router.get("/{opportunity_id}/qualification", response_model=QualificationScoreRead)
def get_latest_qualification(opportunity_id: int, db: Session = Depends(get_db)):
    """Return the most recent qualification score for an opportunity."""
    if not db.get(Opportunity, opportunity_id):
        raise HTTPException(status_code=404, detail="Opportunity not found")

    score = (
        db.query(QualificationScore)
        .filter(QualificationScore.opportunity_id == opportunity_id)
        .order_by(QualificationScore.scored_at.desc())
        .first()
    )
    if not score:
        raise HTTPException(status_code=404, detail="No qualification score found")
    return score


@router.get(
    "/{opportunity_id}/qualifications", response_model=list[QualificationScoreRead]
)
def list_qualifications(opportunity_id: int, db: Session = Depends(get_db)):
    """Return all qualification scores for an opportunity (newest first)."""
    if not db.get(Opportunity, opportunity_id):
        raise HTTPException(status_code=404, detail="Opportunity not found")

    return (
        db.query(QualificationScore)
        .filter(QualificationScore.opportunity_id == opportunity_id)
        .order_by(QualificationScore.scored_at.desc())
        .all()
    )
