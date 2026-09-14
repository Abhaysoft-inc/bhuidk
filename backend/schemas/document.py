from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CitationInfo(BaseModel):
    id: int
    document_id: int
    title: str
    document_number: Optional[str] = None
    type: str
    ministry: str
    year: int
    citation_type: str
    section_reference: Optional[str] = None
    context_snippet: Optional[str] = None

    class Config:
        from_attributes = True

class DocumentListItem(BaseModel):
    id: int
    title: str
    document_number: Optional[str] = None
    type: str
    ministry: str
    state: str
    year: int
    date_published: Optional[str] = None
    summary: str
    tags: Optional[str] = None
    file_url: Optional[str] = None
    file_size: Optional[str] = None
    page_count: Optional[int] = None
    created_at: datetime
    citations_made_count: int = 0
    cited_by_count: int = 0

    class Config:
        from_attributes = True

class DocumentDetail(DocumentListItem):
    full_text: str
    key_clauses: Optional[str] = None
    citations_made: List[CitationInfo] = []
    cited_by: List[CitationInfo] = []  # Backlinks ("cited in")

class DocumentCreate(BaseModel):
    title: str
    document_number: Optional[str] = None
    type: str
    ministry: str
    state: str = "National"
    year: int
    date_published: Optional[str] = None
    summary: str
    full_text: str
    key_clauses: Optional[str] = None
    tags: Optional[str] = None
    file_url: Optional[str] = None
    file_size: Optional[str] = None
    page_count: Optional[int] = None

class DocumentFilterOptions(BaseModel):
    types: List[str]
    ministries: List[str]
    states: List[str]
    years: List[int]
    total_count: int
