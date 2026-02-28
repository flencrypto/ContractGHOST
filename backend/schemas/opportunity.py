"""Pydantic v2 schemas for Opportunity and QualificationScore."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from backend.models.opportunity import GoNoGo, MEPComplexity, OpportunityStage


# ── Opportunity ───────────────────────────────────────────────────────────────

class OpportunityBase(BaseModel):
    account_id: int
    title: str = Field(..., max_length=255)
    description: str | None = None
    stage: OpportunityStage = OpportunityStage.target
    estimated_value: float | None = None
    currency: str = Field("GBP", max_length=3)


class OpportunityCreate(OpportunityBase):
    pass


class OpportunityUpdate(BaseModel):
    title: str | None = Field(None, max_length=255)
    description: str | None = None
    stage: OpportunityStage | None = None
    estimated_value: float | None = None
    currency: str | None = Field(None, max_length=3)


class OpportunityRead(OpportunityBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


# ── QualificationScore ────────────────────────────────────────────────────────

class QualificationScoreCreate(BaseModel):
    """Input payload for the qualification scoring endpoint."""

    budget_confidence: float = Field(..., ge=0, le=10)
    route_to_market_clarity: float = Field(..., ge=0, le=10)
    incumbent_lock_in_risk: float = Field(..., ge=0, le=10)
    procurement_timeline_realism: float = Field(..., ge=0, le=10)
    technical_fit: float = Field(..., ge=0, le=10)
    tier_level: str | None = Field(None, max_length=10)
    uptime_target: float | None = None
    mep_complexity: MEPComplexity | None = None
    live_environment: bool = False
    rationale: str | None = None


class QualificationScoreRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    opportunity_id: int
    budget_confidence: float
    route_to_market_clarity: float
    incumbent_lock_in_risk: float
    procurement_timeline_realism: float
    technical_fit: float
    tier_level: str | None
    uptime_target: float | None
    mep_complexity: MEPComplexity | None
    live_environment: bool
    overall_score: float
    go_no_go: GoNoGo
    rationale: str | None
    scored_at: datetime
