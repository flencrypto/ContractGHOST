"""CRUD router for EstimatingProjects, ScopeGapItems, and ChecklistItems."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.bid import Bid
from backend.models.estimating import (
    ChecklistItem,
    EstimatingProject,
    ScopeGapCategory,
    ScopeGapItem,
)
from backend.schemas.estimating import (
    ChecklistItemCreate,
    ChecklistItemRead,
    ChecklistItemUpdate,
    EstimatingProjectCreate,
    EstimatingProjectRead,
    EstimatingProjectUpdate,
    ScopeGapItemCreate,
    ScopeGapItemRead,
    ScopeGapItemUpdate,
    ScopeGapReport,
)

router = APIRouter(prefix="/estimating", tags=["Estimating"])


# ── EstimatingProject CRUD ────────────────────────────────────────────────────

@router.get("", response_model=list[EstimatingProjectRead])
def list_projects(
    bid_id: int | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List estimating projects, optionally filtered by bid."""
    q = db.query(EstimatingProject)
    if bid_id is not None:
        q = q.filter(EstimatingProject.bid_id == bid_id)
    return q.offset(skip).limit(limit).all()


@router.post("", response_model=EstimatingProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(payload: EstimatingProjectCreate, db: Session = Depends(get_db)):
    """Create a new estimating project."""
    if not db.get(Bid, payload.bid_id):
        raise HTTPException(status_code=404, detail="Bid not found")
    obj = EstimatingProject(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.get("/{project_id}", response_model=EstimatingProjectRead)
def get_project(project_id: int, db: Session = Depends(get_db)):
    obj = db.get(EstimatingProject, project_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Estimating project not found")
    return obj


@router.patch("/{project_id}", response_model=EstimatingProjectRead)
def update_project(
    project_id: int, payload: EstimatingProjectUpdate, db: Session = Depends(get_db)
):
    obj = db.get(EstimatingProject, project_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Estimating project not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    obj = db.get(EstimatingProject, project_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Estimating project not found")
    db.delete(obj)
    db.commit()


# ── ScopeGapItems ─────────────────────────────────────────────────────────────

@router.get("/{project_id}/scope-gaps", response_model=list[ScopeGapItemRead])
def list_scope_gaps(project_id: int, db: Session = Depends(get_db)):
    if not db.get(EstimatingProject, project_id):
        raise HTTPException(status_code=404, detail="Estimating project not found")
    return db.query(ScopeGapItem).filter(ScopeGapItem.project_id == project_id).all()


@router.post(
    "/{project_id}/scope-gaps",
    response_model=ScopeGapItemRead,
    status_code=status.HTTP_201_CREATED,
)
def create_scope_gap(
    project_id: int, payload: ScopeGapItemCreate, db: Session = Depends(get_db)
):
    if not db.get(EstimatingProject, project_id):
        raise HTTPException(status_code=404, detail="Estimating project not found")
    data = payload.model_dump()
    data["project_id"] = project_id
    obj = ScopeGapItem(**data)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.patch("/{project_id}/scope-gaps/{item_id}", response_model=ScopeGapItemRead)
def update_scope_gap(
    project_id: int, item_id: int, payload: ScopeGapItemUpdate, db: Session = Depends(get_db)
):
    obj = db.get(ScopeGapItem, item_id)
    if not obj or obj.project_id != project_id:
        raise HTTPException(status_code=404, detail="Scope gap item not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{project_id}/scope-gaps/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scope_gap(project_id: int, item_id: int, db: Session = Depends(get_db)):
    obj = db.get(ScopeGapItem, item_id)
    if not obj or obj.project_id != project_id:
        raise HTTPException(status_code=404, detail="Scope gap item not found")
    db.delete(obj)
    db.commit()


# ── ChecklistItems ────────────────────────────────────────────────────────────

@router.get("/{project_id}/checklist", response_model=list[ChecklistItemRead])
def list_checklist(project_id: int, db: Session = Depends(get_db)):
    if not db.get(EstimatingProject, project_id):
        raise HTTPException(status_code=404, detail="Estimating project not found")
    return db.query(ChecklistItem).filter(ChecklistItem.project_id == project_id).all()


@router.post(
    "/{project_id}/checklist",
    response_model=ChecklistItemRead,
    status_code=status.HTTP_201_CREATED,
)
def create_checklist_item(
    project_id: int, payload: ChecklistItemCreate, db: Session = Depends(get_db)
):
    if not db.get(EstimatingProject, project_id):
        raise HTTPException(status_code=404, detail="Estimating project not found")
    data = payload.model_dump()
    data["project_id"] = project_id
    obj = ChecklistItem(**data)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.patch("/{project_id}/checklist/{item_id}", response_model=ChecklistItemRead)
def update_checklist_item(
    project_id: int,
    item_id: int,
    payload: ChecklistItemUpdate,
    db: Session = Depends(get_db),
):
    obj = db.get(ChecklistItem, item_id)
    if not obj or obj.project_id != project_id:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{project_id}/checklist/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_checklist_item(project_id: int, item_id: int, db: Session = Depends(get_db)):
    obj = db.get(ChecklistItem, item_id)
    if not obj or obj.project_id != project_id:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    db.delete(obj)
    db.commit()


# ── Scope Gap Report ──────────────────────────────────────────────────────────

@router.get("/{project_id}/scope-gap-report", response_model=ScopeGapReport)
def scope_gap_report(project_id: int, db: Session = Depends(get_db)):
    """
    Generate a scope gap analysis report for an estimating project.

    Risk score formula:
        risk = (unidentified / total * 50) + (not_in_price / total * 30)
               + (owner_not_agreed / total * 20)
        Clamped to [0, 100]. Returns 0 when no items exist.
    """
    project = db.get(EstimatingProject, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Estimating project not found")

    items: list[ScopeGapItem] = (
        db.query(ScopeGapItem).filter(ScopeGapItem.project_id == project_id).all()
    )

    total = len(items)
    identified = sum(1 for i in items if i.identified)
    unidentified = total - identified
    not_in_price = sum(1 for i in items if not i.included_in_price)
    owner_not_agreed = sum(1 for i in items if not i.owner_agreed)

    # Risk score
    if total > 0:
        risk_score = round(
            (unidentified / total * 50)
            + (not_in_price / total * 30)
            + (owner_not_agreed / total * 20),
            1,
        )
    else:
        risk_score = 0.0

    # Group items by category
    gaps_by_category: dict[str, list[dict]] = {}
    for item in items:
        cat = item.category.value
        gaps_by_category.setdefault(cat, []).append(
            {
                "id": item.id,
                "description": item.description,
                "identified": item.identified,
                "owner_agreed": item.owner_agreed,
                "included_in_price": item.included_in_price,
                "notes": item.notes,
            }
        )

    # Build action items list
    action_items: list[str] = []
    for item in items:
        if not item.identified:
            action_items.append(f"[{item.category.value}] Identify: {item.description}")
        elif not item.owner_agreed:
            action_items.append(
                f"[{item.category.value}] Agree with client/owner: {item.description}"
            )
        elif not item.included_in_price:
            action_items.append(
                f"[{item.category.value}] Confirm pricing inclusion: {item.description}"
            )

    return ScopeGapReport(
        project_id=project_id,
        total_items=total,
        identified_count=identified,
        unidentified_count=unidentified,
        not_included_in_price=not_in_price,
        owner_not_agreed=owner_not_agreed,
        risk_score=risk_score,
        gaps_by_category=gaps_by_category,
        action_items=action_items,
    )
