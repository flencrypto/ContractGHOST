"""Call Intelligence router – Audio + Text + Key Points extraction + Auto linking to Opportunities/Jobs."""

import json
import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Body, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.account import Account, AccountType
from backend.models.opportunity import Opportunity, OpportunityStage
from backend.models.tender import CallIntelligence
from backend.schemas.tender import CallIntelligenceCreate, CallIntelligenceRead
from backend.services.ai_workers import CallIntelWorker

logger = logging.getLogger("align.calls")

router = APIRouter(prefix="/calls", tags=["Call Intelligence"])

_call_intel_worker = CallIntelWorker()

_AUDIO_ALLOWED_TYPES = {"audio/mpeg", "audio/mp3", "audio/wav", "audio/x-m4a", "audio/m4a", "audio/ogg"}
_AUDIO_MAX_BYTES = 50 * 1024 * 1024  # 50 MB


def _load_list(value: str | None) -> list[str] | None:
    if value is None:
        return None
    try:
        parsed = json.loads(value)
        if isinstance(parsed, list):
            return [str(i) for i in parsed]
    except (json.JSONDecodeError, TypeError):
        pass
    return [value] if value else None


def _serialise_next_steps(value) -> str | None:
    if value is None:
        return None
    if isinstance(value, list):
        return json.dumps(value)
    return str(value)


def _call_to_read(obj: CallIntelligence) -> CallIntelligenceRead:
    return CallIntelligenceRead(
        id=obj.id,
        company_name=obj.company_name,
        executive_name=obj.executive_name,
        transcript=obj.transcript,
        sentiment_score=obj.sentiment_score,
        competitor_mentions=_load_list(obj.competitor_mentions),
        budget_signals=_load_list(obj.budget_signals),
        timeline_mentions=_load_list(obj.timeline_mentions),
        risk_language=_load_list(obj.risk_language),
        objection_categories=_load_list(obj.objection_categories),
        next_steps=obj.next_steps,
        key_points=json.loads(obj.key_points) if obj.key_points else [],
        created_at=obj.created_at,
    )


# ── ANALYSE (audio OR text) + KEY POINTS EXTRACTION ───────────────────────────
@router.post(
    "/analyse",
    response_model=CallIntelligenceRead,
    status_code=status.HTTP_201_CREATED,
    summary="Upload audio OR paste transcript → Grok transcribes, analyses + extracts key points",
)
async def analyse_call(
    file: UploadFile | None = File(None),
    company_name: str | None = Form(None),
    executive_name: str | None = Form(None),
    transcript: str | None = Form(None),
    db: Session = Depends(get_db),
):
    """Full pipeline: audio transcription → Grok analysis → key points extraction → structured record."""

    # ── 1. Get transcript (audio or text) ─────────────────────────────────
    if file:
        if file.content_type not in _AUDIO_ALLOWED_TYPES:
            raise HTTPException(415, f"Unsupported audio type: {file.content_type}. Use mp3/wav/m4a.")
        audio_data = await file.read()
        if len(audio_data) > _AUDIO_MAX_BYTES:
            raise HTTPException(413, "Audio file too large (max 50 MB)")
        logger.info(f"Transcribing audio file: {file.filename} ({len(audio_data)/1024/1024:.1f} MB)")
        transcript_text = await _call_intel_worker.transcribe_audio(audio_data, file.filename or "call")
    elif transcript and transcript.strip():
        transcript_text = transcript.strip()
    else:
        raise HTTPException(422, "Either upload an audio file OR provide transcript text")

    if not transcript_text:
        raise HTTPException(422, "Could not extract any transcript from the audio")

    # ── 2. Run full Grok analysis + key points extraction ─────────────────
    logger.info(f"Running Grok analysis on {len(transcript_text)} characters")
    signals = await _call_intel_worker.run(transcript_text)

    # ── 3. Save to database ───────────────────────────────────────────────
    obj = CallIntelligence(
        company_name=company_name,
        executive_name=executive_name,
        transcript=transcript_text,
        sentiment_score=signals.get("sentiment_score"),
        competitor_mentions=json.dumps(signals.get("competitor_mentions") or []),
        budget_signals=json.dumps(signals.get("budget_signals") or []),
        timeline_mentions=json.dumps(signals.get("timeline_mentions") or []),
        risk_language=json.dumps(signals.get("risk_flags") or signals.get("risk_language") or []),
        objection_categories=json.dumps(signals.get("objections") or signals.get("objection_categories") or []),
        next_steps=_serialise_next_steps(signals.get("recommended_next_steps")),
        key_points=json.dumps(signals.get("key_points") or []),
    )

    db.add(obj)
    db.commit()
    db.refresh(obj)

    kp_count = len(signals.get("key_points") or [])
    logger.info(f"Call record created – ID {obj.id} with {kp_count} key points")
    return _call_to_read(obj)


# ── LINK OR CREATE FROM KEY POINT ─────────────────────────────────────────────
@router.post(
    "/{call_id}/key-points/{point_index}/link",
    response_model=CallIntelligenceRead,
    summary="Create new Opportunity/Job OR link existing record from a key point",
)
async def link_key_point(
    call_id: int,
    point_index: int,
    opportunity_id: int | None = Body(None, embed=True),
    db: Session = Depends(get_db),
):
    """From a key point in the call, either link to an existing Opportunity or auto-create one.

    Pass `opportunity_id` in the JSON body to link to an existing record.
    Omit it to auto-create: a new Account (for the mentioned company) and
    Opportunity are created and linked back to this key point.
    Records who discussed it and the context of what was said.
    """
    call = db.get(CallIntelligence, call_id)
    if not call:
        raise HTTPException(404, "Call record not found")

    try:
        key_points: list[dict] = json.loads(call.key_points or "[]")
        point = key_points[point_index]
    except (IndexError, json.JSONDecodeError, TypeError):
        raise HTTPException(404, "Key point not found")

    if opportunity_id is not None:
        # Link to an existing Opportunity
        opp = db.get(Opportunity, opportunity_id)
        if not opp:
            raise HTTPException(404, f"Opportunity {opportunity_id} not found")
    else:
        # Auto-create: find or create Account for the mentioned company
        mentioned_company = point.get("mentioned_company") or call.company_name or "Unknown"

        account = (
            db.query(Account)
            .filter(Account.name.ilike(f"%{mentioned_company}%"))
            .first()
        )
        if not account:
            account = Account(
                name=mentioned_company,
                type=AccountType.enterprise,
            )
            db.add(account)
            db.flush()  # get account.id without committing

        title_raw = point.get("mentioned_job_title") or point.get("text") or "Discussed opportunity"
        opp = Opportunity(
            account_id=account.id,
            title=str(title_raw)[:255],
            stage=OpportunityStage.target,
            description=(
                f"Discussed in call with {call.executive_name or 'unknown'}.\n\n"
                f"What was said:\n{point.get('context') or point.get('text', '')}"
            ),
        )
        db.add(opp)
        db.commit()
        db.refresh(opp)

    # Store the link back in the key point
    key_points[point_index]["linked_opportunity_id"] = opp.id
    key_points[point_index]["linked_by"] = call.executive_name
    key_points[point_index]["linked_at"] = datetime.now(timezone.utc).isoformat()

    call.key_points = json.dumps(key_points)
    db.commit()
    db.refresh(call)

    logger.info(f"Linked key point {point_index} from call {call_id} → Opportunity {opp.id}")
    return _call_to_read(call)


# ── List, Get, Delete ─────────────────────────────────────────────────────────
@router.get("", response_model=list[CallIntelligenceRead])
def list_calls(
    company_name: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    q = db.query(CallIntelligence).order_by(CallIntelligence.created_at.desc())
    if company_name:
        q = q.filter(CallIntelligence.company_name.ilike(f"%{company_name}%"))
    return [_call_to_read(obj) for obj in q.offset(skip).limit(limit).all()]


@router.get("/{call_id}", response_model=CallIntelligenceRead)
def get_call(call_id: int, db: Session = Depends(get_db)):
    obj = db.get(CallIntelligence, call_id)
    if not obj:
        raise HTTPException(404, "Call intelligence record not found")
    return _call_to_read(obj)


@router.delete("/{call_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_call(call_id: int, db: Session = Depends(get_db)):
    obj = db.get(CallIntelligence, call_id)
    if not obj:
        raise HTTPException(404, "Call intelligence record not found")
    db.delete(obj)
    db.commit()
    logger.info(f"Deleted call intelligence record {call_id}")
