from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.engine import get_db
from schemas.search import SearchQueryRequest, SynthesisResponse
from services.search_service import run_semantic_search_and_synthesis

router = APIRouter(prefix="/search", tags=["Search & Synthesis"])

@router.post("/query", response_model=SynthesisResponse)
def search_and_synthesize(req: SearchQueryRequest, db: Session = Depends(get_db)):
    if not req.query or not req.query.strip():
        raise HTTPException(status_code=400, detail="Search query string cannot be empty.")
    return run_semantic_search_and_synthesis(db, req)
