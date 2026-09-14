from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from db.base import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    document_number = Column(String, index=True, nullable=True)
    type = Column(String, index=True, nullable=False)  # Act / Legislation, Policy Guideline, Judgement, Circular / Notification, etc.
    ministry = Column(String, index=True, nullable=False)
    state = Column(String, index=True, nullable=False, default="National")
    year = Column(Integer, index=True, nullable=False)
    date_published = Column(String, nullable=True)
    
    # Text Content
    summary = Column(Text, nullable=False)
    full_text = Column(Text, nullable=False)
    key_clauses = Column(Text, nullable=True)  # JSON formatted key highlights or sections
    tags = Column(String, nullable=True)  # comma-delimited tags
    
    # File details
    file_url = Column(String, nullable=True)
    file_size = Column(String, nullable=True)
    page_count = Column(Integer, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    citations_made = relationship(
        "Citation",
        foreign_keys="Citation.source_doc_id",
        back_populates="source_document",
        cascade="all, delete-orphan",
    )
    cited_by = relationship(
        "Citation",
        foreign_keys="Citation.target_doc_id",
        back_populates="target_document",
        cascade="all, delete-orphan",
    )
