from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any
from db.engine import get_db
from schemas.simulation import SimulationRequest, SimulationResultResponse
from services.simulation_service import run_policy_simulation, POLICY_CATALOG

router = APIRouter(prefix="/simulation", tags=["Reform Sandbox"])

@router.post("/run", response_model=SimulationResultResponse)
def simulate_policy_reform(req: SimulationRequest, db: Session = Depends(get_db)):
    return run_policy_simulation(db, req)

@router.get("/policies", response_model=Dict[str, Any])
def list_simulation_policies():
    return {
        "policies": [
            {
                "id": k,
                "name": v["name"],
                "description": v["description"],
                "boundary_dispute_reduction": v["boundary_dispute_reduction"],
                "mutation_dispute_reduction": v["mutation_dispute_reduction"],
                "resolution_speedup_factor": v["resolution_speedup_factor"],
                "economic_unlock_per_ha_lakhs": v["economic_unlock_per_ha_lakhs"],
            }
            for k, v in POLICY_CATALOG.items()
        ]
    }
