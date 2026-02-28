"""CRUD router for Accounts, Contacts, and TriggerSignals."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.account import Account, Contact, TriggerSignal
from backend.schemas.account import (
    AccountCreate,
    AccountRead,
    AccountUpdate,
    ContactCreate,
    ContactRead,
    ContactUpdate,
    TriggerSignalCreate,
    TriggerSignalRead,
    TriggerSignalUpdate,
)

router = APIRouter(prefix="/accounts", tags=["Accounts"])


# ── Accounts ──────────────────────────────────────────────────────────────────

@router.get("", response_model=list[AccountRead])
def list_accounts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Return a paginated list of accounts."""
    return db.query(Account).offset(skip).limit(limit).all()


@router.post("", response_model=AccountRead, status_code=status.HTTP_201_CREATED)
def create_account(payload: AccountCreate, db: Session = Depends(get_db)):
    """Create a new account."""
    obj = Account(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.get("/{account_id}", response_model=AccountRead)
def get_account(account_id: int, db: Session = Depends(get_db)):
    """Retrieve a single account by ID."""
    obj = db.get(Account, account_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Account not found")
    return obj


@router.patch("/{account_id}", response_model=AccountRead)
def update_account(account_id: int, payload: AccountUpdate, db: Session = Depends(get_db)):
    """Partially update an account."""
    obj = db.get(Account, account_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Account not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(account_id: int, db: Session = Depends(get_db)):
    """Delete an account and all related records."""
    obj = db.get(Account, account_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Account not found")
    db.delete(obj)
    db.commit()


# ── Contacts ──────────────────────────────────────────────────────────────────

contacts_router = APIRouter(prefix="/contacts", tags=["Contacts"])


@contacts_router.get("", response_model=list[ContactRead])
def list_contacts(
    account_id: int | None = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """List contacts, optionally filtered by account."""
    q = db.query(Contact)
    if account_id is not None:
        q = q.filter(Contact.account_id == account_id)
    return q.offset(skip).limit(limit).all()


@contacts_router.post("", response_model=ContactRead, status_code=status.HTTP_201_CREATED)
def create_contact(payload: ContactCreate, db: Session = Depends(get_db)):
    """Create a new contact."""
    if not db.get(Account, payload.account_id):
        raise HTTPException(status_code=404, detail="Account not found")
    obj = Contact(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@contacts_router.get("/{contact_id}", response_model=ContactRead)
def get_contact(contact_id: int, db: Session = Depends(get_db)):
    obj = db.get(Contact, contact_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Contact not found")
    return obj


@contacts_router.patch("/{contact_id}", response_model=ContactRead)
def update_contact(contact_id: int, payload: ContactUpdate, db: Session = Depends(get_db)):
    obj = db.get(Contact, contact_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Contact not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


@contacts_router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    obj = db.get(Contact, contact_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(obj)
    db.commit()


# ── TriggerSignals ────────────────────────────────────────────────────────────

signals_router = APIRouter(prefix="/trigger-signals", tags=["Trigger Signals"])


@signals_router.get("", response_model=list[TriggerSignalRead])
def list_signals(
    account_id: int | None = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """List trigger signals, optionally filtered by account."""
    q = db.query(TriggerSignal)
    if account_id is not None:
        q = q.filter(TriggerSignal.account_id == account_id)
    return q.offset(skip).limit(limit).all()


@signals_router.post("", response_model=TriggerSignalRead, status_code=status.HTTP_201_CREATED)
def create_signal(payload: TriggerSignalCreate, db: Session = Depends(get_db)):
    if not db.get(Account, payload.account_id):
        raise HTTPException(status_code=404, detail="Account not found")
    obj = TriggerSignal(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@signals_router.get("/{signal_id}", response_model=TriggerSignalRead)
def get_signal(signal_id: int, db: Session = Depends(get_db)):
    obj = db.get(TriggerSignal, signal_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Trigger signal not found")
    return obj


@signals_router.patch("/{signal_id}", response_model=TriggerSignalRead)
def update_signal(signal_id: int, payload: TriggerSignalUpdate, db: Session = Depends(get_db)):
    obj = db.get(TriggerSignal, signal_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Trigger signal not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


@signals_router.delete("/{signal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_signal(signal_id: int, db: Session = Depends(get_db)):
    obj = db.get(TriggerSignal, signal_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Trigger signal not found")
    db.delete(obj)
    db.commit()
