from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class DistrictItem(BaseModel):
    id: int
    code: str
    name: str
    state: str
    state_code: str
    total_land_area_sqkm: float
    rural_population: int
    urban_population: int
    digitized_records_pct: float
    cadastral_accuracy_pct: float
    active_disputes_count: int
    avg_resolution_days: float
    tribunal_active: bool

    class Config:
        from_attributes = True

class DisputeTrendPoint(BaseModel):
    year: int
    filed: int
    resolved: int
    pending_end_of_year: int

class CauseBreakdownItem(BaseModel):
    cause: str
    count: int
    percentage: float
    avg_resolution_days: float
    total_value_lakhs: float

class DisputeTypeBreakdownItem(BaseModel):
    type: str
    count: int
    percentage: float

class BenchmarkMetric(BaseModel):
    district_value: float
    state_avg: float
    national_avg: float
    comparison_text: str

class DistrictDashboardResponse(BaseModel):
    district: DistrictItem
    kpis: Dict[str, Any]
    dispute_trends: List[DisputeTrendPoint]
    cause_breakdown: List[CauseBreakdownItem]
    dispute_type_breakdown: List[DisputeTypeBreakdownItem]
    benchmarks: Dict[str, BenchmarkMetric]
    recent_cases: List[Dict[str, Any]]
