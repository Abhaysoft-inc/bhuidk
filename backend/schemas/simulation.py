from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class SimulationRequest(BaseModel):
    policy_type: str = Field(
        ...,
        description="Policy intervention: 'drone_cadastral_svamitva', 'fast_track_tribunal', 'auto_mutation_blockchain', 'community_lok_adalat', or 'title_guarantee_act'"
    )
    district_id: Optional[int] = None
    target_coverage_pct: float = Field(80.0, ge=10.0, le=100.0, description="Coverage target %")
    implementation_years: int = Field(3, ge=1, le=10, description="Implementation timeline in years")
    budget_allocated_crores: float = Field(25.0, ge=1.0, description="Budget in INR Crores")
    digitization_investment_factor: float = Field(1.0, ge=0.5, le=3.0, description="Multiplier for tech staff & training")

class FormulaStep(BaseModel):
    step_name: str
    target_variable: str
    formula: str
    values_used: str
    calculated_output: str
    rationale: str

class YearlyProjection(BaseModel):
    year: int
    year_label: str
    coverage_achieved_pct: float
    new_disputes_filed: int
    disputes_resolved: int
    backlog_pending: int
    avg_resolution_days: float
    economic_value_unlocked_crores: float

class SimulationResultResponse(BaseModel):
    simulation_id: str
    policy_name: str
    policy_description: str
    parameters: Dict[str, Any]
    baseline: Dict[str, Any]
    projected: Dict[str, Any]
    net_impact: Dict[str, Any]
    formulas_applied: List[FormulaStep]
    timeline_projections: List[YearlyProjection]
    policy_recommendations: List[str]
    risks_and_mitigations: List[Dict[str, str]]
