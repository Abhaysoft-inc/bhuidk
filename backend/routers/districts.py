from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from db.engine import get_db
from schemas.dashboard import DistrictItem, DistrictDashboardResponse
from services.dashboard_service import get_all_districts, get_district_dashboard_data

router = APIRouter(prefix="/districts", tags=["District Dashboard"])

@router.get("", response_model=List[DistrictItem])
def list_districts(db: Session = Depends(get_db)):
    return get_all_districts(db)

@router.get("/{district_id}/dashboard", response_model=DistrictDashboardResponse)
def get_district_dashboard(district_id: int, db: Session = Depends(get_db)):
    data = get_district_dashboard_data(db, district_id)
    if not data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"District with ID {district_id} was not found.",
        )
    return data
