"""Opportunity and QualificationScore SQLAlchemy models."""

import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database import Base


class OpportunityStage(str, enum.Enum):
    target = "target"
    lead = "lead"
    qualified = "qualified"
    bid = "bid"
    won = "won"
    lost = "lost"
    delivered = "delivered"


class MEPComplexity(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class GoNoGo(str, enum.Enum):
    go = "go"
    no_go = "no_go"
    conditional = "conditional"


class Opportunity(Base):
    """A potential contract opportunity linked to an account."""

    __tablename__ = "opportunities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    account_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    stage: Mapped[OpportunityStage] = mapped_column(
        Enum(OpportunityStage), default=OpportunityStage.target, server_default="target"
    )
    estimated_value: Mapped[float | None] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String(3), default="GBP", server_default="GBP")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), onupdate=func.now(), server_default=func.now()
    )

    account: Mapped["Account"] = relationship("Account", back_populates="opportunities")  # type: ignore[name-defined]
    qualification_scores: Mapped[list["QualificationScore"]] = relationship(
        "QualificationScore", back_populates="opportunity", cascade="all, delete-orphan"
    )
    bids: Mapped[list] = relationship(
        "Bid", back_populates="opportunity", cascade="all, delete-orphan"
    )


class QualificationScore(Base):
    """Stores the result of a go/no-go qualification scoring session."""

    __tablename__ = "qualification_scores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    opportunity_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=False
    )
    budget_confidence: Mapped[float] = mapped_column(Float, nullable=False)
    route_to_market_clarity: Mapped[float] = mapped_column(Float, nullable=False)
    incumbent_lock_in_risk: Mapped[float] = mapped_column(Float, nullable=False)
    procurement_timeline_realism: Mapped[float] = mapped_column(Float, nullable=False)
    technical_fit: Mapped[float] = mapped_column(Float, nullable=False)
    tier_level: Mapped[str | None] = mapped_column(String(10))
    uptime_target: Mapped[float | None] = mapped_column(Float)
    mep_complexity: Mapped[MEPComplexity | None] = mapped_column(Enum(MEPComplexity))
    live_environment: Mapped[bool] = mapped_column(Boolean, default=False)
    overall_score: Mapped[float] = mapped_column(Float, nullable=False)
    go_no_go: Mapped[GoNoGo] = mapped_column(Enum(GoNoGo), nullable=False)
    rationale: Mapped[str | None] = mapped_column(Text)
    scored_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), server_default=func.now()
    )

    opportunity: Mapped["Opportunity"] = relationship(
        "Opportunity", back_populates="qualification_scores"
    )
