"""Pydantic v2 schemas for Bid, BidDocument, ComplianceItem, and RFI."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from backend.models.bid import (
    BidStatus,
    ComplianceStatus,
    DocType,
    RFIPriority,
    RFIStatus,
)


# ── Bid ───────────────────────────────────────────────────────────────────────

class BidBase(BaseModel):
    opportunity_id: int
    title: str = Field(..., max_length=255)
    tender_ref: str | None = Field(None, max_length=100)
    submission_date: datetime | None = None
    status: BidStatus = BidStatus.draft
    win_themes: str | None = None
    notes: str | None = None


class BidCreate(BidBase):
    pass


class BidUpdate(BaseModel):
    title: str | None = Field(None, max_length=255)
    tender_ref: str | None = Field(None, max_length=100)
    submission_date: datetime | None = None
    status: BidStatus | None = None
    win_themes: str | None = None
    notes: str | None = None


class BidRead(BidBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


# ── BidDocument ───────────────────────────────────────────────────────────────

class BidDocumentBase(BaseModel):
    bid_id: int
    filename: str = Field(..., max_length=255)
    doc_type: DocType
    content_text: str | None = None
    extracted_requirements: str | None = None  # JSON string


class BidDocumentCreate(BidDocumentBase):
    pass


class BidDocumentUpdate(BaseModel):
    filename: str | None = Field(None, max_length=255)
    doc_type: DocType | None = None
    content_text: str | None = None
    extracted_requirements: str | None = None


class BidDocumentRead(BidDocumentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uploaded_at: datetime


# ── ComplianceItem ────────────────────────────────────────────────────────────

class ComplianceItemBase(BaseModel):
    bid_id: int
    requirement: str
    category: str | None = Field(None, max_length=100)
    compliance_status: ComplianceStatus = ComplianceStatus.tbc
    evidence: str | None = None
    owner: str | None = Field(None, max_length=255)
    notes: str | None = None


class ComplianceItemCreate(ComplianceItemBase):
    pass


class ComplianceItemUpdate(BaseModel):
    requirement: str | None = None
    category: str | None = Field(None, max_length=100)
    compliance_status: ComplianceStatus | None = None
    evidence: str | None = None
    owner: str | None = Field(None, max_length=255)
    notes: str | None = None


class ComplianceItemRead(ComplianceItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


# ── RFI ───────────────────────────────────────────────────────────────────────

class RFIBase(BaseModel):
    bid_id: int
    question: str
    category: str | None = Field(None, max_length=100)
    priority: RFIPriority = RFIPriority.medium
    status: RFIStatus = RFIStatus.draft
    answer: str | None = None
    submitted_at: datetime | None = None
    answered_at: datetime | None = None


class RFICreate(RFIBase):
    pass


class RFIUpdate(BaseModel):
    question: str | None = None
    category: str | None = Field(None, max_length=100)
    priority: RFIPriority | None = None
    status: RFIStatus | None = None
    answer: str | None = None
    submitted_at: datetime | None = None
    answered_at: datetime | None = None


class RFIRead(RFIBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
