from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class SearchQueryRequest(BaseModel):
    query: str
    ministry: Optional[str] = None
    state: Optional[str] = None
    type: Optional[str] = None
    year_start: Optional[int] = None
    year_end: Optional[int] = None
    top_k: int = 5

class CitationChunk(BaseModel):
    document_id: int
    title: str
    document_number: Optional[str] = None
    ministry: str
    year: int
    section_reference: Optional[str] = None
    snippet: str
    relevance_score: float

class SynthesisResponse(BaseModel):
    query: str
    answer: str
    key_findings: List[str] = []
    grounding_confidence: float
    citations: List[CitationChunk]
    related_queries: List[str] = []
    model_used: str = "LandGov Synthesis Engine v1"
