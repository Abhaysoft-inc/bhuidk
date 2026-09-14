from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from db.engine import get_db
from models.user import User
from schemas.document import (
    DocumentListItem,
    DocumentDetail,
    DocumentCreate,
    DocumentFilterOptions,
)
from services.document_service import (
    get_documents_filtered,
    get_filter_options,
    get_document_by_id,
    create_document,
)
from middleware.auth import get_optional_user, role_required

router = APIRouter(prefix="/documents", tags=["Document Library"])

@router.get("", response_model=Dict[str, Any])
def list_documents(
    type: Optional[str] = Query(None, description="Document type filter"),
    ministry: Optional[str] = Query(None, description="Ministry filter"),
    state: Optional[str] = Query(None, description="State filter"),
    year: Optional[int] = Query(None, description="Year filter"),
    q: Optional[str] = Query(None, description="Search keyword"),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * limit
    items, total = get_documents_filtered(
        db, type_=type, ministry=ministry, state=state, year=year, q=q, skip=skip, limit=limit
    )
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit if total > 0 else 1,
    }

@router.get("/filters", response_model=DocumentFilterOptions)
def get_document_filters(db: Session = Depends(get_db)):
    return get_filter_options(db)

@router.get("/{document_id}", response_model=DocumentDetail)
def get_document_detail(document_id: int, db: Session = Depends(get_db)):
    doc = get_document_by_id(db, document_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID {document_id} was not found.",
        )
    return doc

@router.post("", response_model=DocumentDetail, status_code=status.HTTP_201_CREATED)
def add_document(
    doc_in: DocumentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(role_required(["Admin", "Government Official", "Policymaker"])),
):
    created = create_document(db, doc_in)
    return get_document_by_id(db, created.id)
