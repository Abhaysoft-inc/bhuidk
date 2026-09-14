from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, distinct
from models.document import Document
from models.citation import Citation
from schemas.document import (
    DocumentListItem,
    DocumentDetail,
    DocumentCreate,
    DocumentFilterOptions,
    CitationInfo,
)

def get_documents_filtered(
    db: Session,
    type_: Optional[str] = None,
    ministry: Optional[str] = None,
    state: Optional[str] = None,
    year: Optional[int] = None,
    q: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> Tuple[List[DocumentListItem], int]:
    query = db.query(Document)

    if type_ and type_ != "All":
        query = query.filter(Document.type == type_)
    if ministry and ministry != "All":
        query = query.filter(Document.ministry == ministry)
    if state and state != "All":
        query = query.filter(Document.state == state)
    if year:
        query = query.filter(Document.year == year)
    if q:
        search_pattern = f"%{q}%"
        query = query.filter(
            or_(
                Document.title.ilike(search_pattern),
                Document.summary.ilike(search_pattern),
                Document.tags.ilike(search_pattern),
                Document.document_number.ilike(search_pattern),
            )
        )

    total_count = query.count()
    docs = query.order_by(desc(Document.year), Document.id).offset(skip).limit(limit).all()

    items = []
    for doc in docs:
        made_count = len(doc.citations_made) if doc.citations_made else 0
        by_count = len(doc.cited_by) if doc.cited_by else 0
        items.append(
            DocumentListItem(
                id=doc.id,
                title=doc.title,
                document_number=doc.document_number,
                type=doc.type,
                ministry=doc.ministry,
                state=doc.state,
                year=doc.year,
                date_published=doc.date_published,
                summary=doc.summary,
                tags=doc.tags,
                file_url=doc.file_url,
                file_size=doc.file_size,
                page_count=doc.page_count,
                created_at=doc.created_at,
                citations_made_count=made_count,
                cited_by_count=by_count,
            )
        )
    return items, total_count

def get_filter_options(db: Session) -> DocumentFilterOptions:
    types = [t[0] for t in db.query(distinct(Document.type)).order_by(Document.type).all() if t[0]]
    ministries = [m[0] for m in db.query(distinct(Document.ministry)).order_by(Document.ministry).all() if m[0]]
    states = [s[0] for s in db.query(distinct(Document.state)).order_by(Document.state).all() if s[0]]
    years = [y[0] for y in db.query(distinct(Document.year)).order_by(desc(Document.year)).all() if y[0]]
    total_count = db.query(Document).count()

    return DocumentFilterOptions(
        types=types,
        ministries=ministries,
        states=states,
        years=years,
        total_count=total_count,
    )

def get_document_by_id(db: Session, doc_id: int) -> Optional[DocumentDetail]:
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        return None

    # Citations made by this document
    citations_made_list: List[CitationInfo] = []
    for cit in doc.citations_made:
        target = cit.target_document
        if target:
            citations_made_list.append(
                CitationInfo(
                    id=cit.id,
                    document_id=target.id,
                    title=target.title,
                    document_number=target.document_number,
                    type=target.type,
                    ministry=target.ministry,
                    year=target.year,
                    citation_type=cit.citation_type,
                    section_reference=cit.section_reference,
                    context_snippet=cit.context_snippet,
                )
            )

    # Backlinks: Documents citing THIS document ("cited in")
    cited_by_list: List[CitationInfo] = []
    for cit in doc.cited_by:
        source = cit.source_document
        if source:
            cited_by_list.append(
                CitationInfo(
                    id=cit.id,
                    document_id=source.id,
                    title=source.title,
                    document_number=source.document_number,
                    type=source.type,
                    ministry=source.ministry,
                    year=source.year,
                    citation_type=cit.citation_type,
                    section_reference=cit.section_reference,
                    context_snippet=cit.context_snippet,
                )
            )

    return DocumentDetail(
        id=doc.id,
        title=doc.title,
        document_number=doc.document_number,
        type=doc.type,
        ministry=doc.ministry,
        state=doc.state,
        year=doc.year,
        date_published=doc.date_published,
        summary=doc.summary,
        full_text=doc.full_text,
        key_clauses=doc.key_clauses,
        tags=doc.tags,
        file_url=doc.file_url,
        file_size=doc.file_size,
        page_count=doc.page_count,
        created_at=doc.created_at,
        citations_made_count=len(citations_made_list),
        cited_by_count=len(cited_by_list),
        citations_made=citations_made_list,
        cited_by=cited_by_list,
    )

def create_document(db: Session, doc_in: DocumentCreate) -> Document:
    db_doc = Document(
        title=doc_in.title,
        document_number=doc_in.document_number,
        type=doc_in.type,
        ministry=doc_in.ministry,
        state=doc_in.state,
        year=doc_in.year,
        date_published=doc_in.date_published,
        summary=doc_in.summary,
        full_text=doc_in.full_text,
        key_clauses=doc_in.key_clauses,
        tags=doc_in.tags,
        file_url=doc_in.file_url,
        file_size=doc_in.file_size,
        page_count=doc_in.page_count,
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc
