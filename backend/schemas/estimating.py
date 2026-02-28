"""Pydantic v2 schemas for EstimatingProject, ScopeGapItem, and ChecklistItem."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from backend.models.estimating import ProjectType, ScopeGapCategory


# ── EstimatingProject ─────────────────────────────────────────────────────────

class EstimatingProjectBase(BaseModel):
    bid_id: int
    project_type: ProjectType
    tier_level: str | None = Field(None, max_length=10)
    total_budget: float | None = None
    contingency_pct: float | None = Field(None, ge=0, le=100)


class EstimatingProjectCreate(EstimatingProjectBase):
    pass


class EstimatingProjectUpdate(BaseModel):
    project_type: ProjectType | None = None
    tier_level: str | None = Field(None, max_length=10)
    total_budget: float | None = None
    contingency_pct: float | None = Field(None, ge=0, le=100)


class EstimatingProjectRead(EstimatingProjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


# ── ScopeGapItem ──────────────────────────────────────────────────────────────

class ScopeGapItemBase(BaseModel):
    project_id: int
    category: ScopeGapCategory
    description: str
    identified: bool = False
    owner_agreed: bool = False
    included_in_price: bool = False
    notes: str | None = None


class ScopeGapItemCreate(ScopeGapItemBase):
    pass


class ScopeGapItemUpdate(BaseModel):
    category: ScopeGapCategory | None = None
    description: str | None = None
    identified: bool | None = None
    owner_agreed: bool | None = None
    included_in_price: bool | None = None
    notes: str | None = None


class ScopeGapItemRead(ScopeGapItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


# ── ChecklistItem ─────────────────────────────────────────────────────────────

class ChecklistItemBase(BaseModel):
    project_id: int
    category: str = Field(..., max_length=100)
    item: str
    completed: bool = False
    notes: str | None = None


class ChecklistItemCreate(ChecklistItemBase):
    pass


class ChecklistItemUpdate(BaseModel):
    category: str | None = Field(None, max_length=100)
    item: str | None = None
    completed: bool | None = None
    notes: str | None = None


class ChecklistItemRead(ChecklistItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


# ── Scope Gap Report ──────────────────────────────────────────────────────────

class ScopeGapReport(BaseModel):
    """Summary report of scope gap analysis for an estimating project."""

    project_id: int
    total_items: int
    identified_count: int
    unidentified_count: int
    not_included_in_price: int
    owner_not_agreed: int
    risk_score: float = Field(description="0-100 risk indicator based on gap coverage")
    gaps_by_category: dict[str, Any]
    action_items: list[str]
