from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base

class Citation(Base):
    __tablename__ = "citations"

    id = Column(Integer, primary_key=True, index=True)
    source_doc_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    target_doc_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    citation_type = Column(String, default="references")  # amends, cites, overrules, interprets, references
    section_reference = Column(String, nullable=True)     # e.g., "Section 24(2)"
    context_snippet = Column(Text, nullable=True)          # Quote or rationale

    # Relationships
    source_document = relationship("Document", foreign_keys=[source_doc_id], back_populates="citations_made")
    target_document = relationship("Document", foreign_keys=[target_doc_id], back_populates="cited_by")
