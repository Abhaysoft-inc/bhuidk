import uuid
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from models.district import District
from schemas.simulation import (
    SimulationRequest,
    SimulationResultResponse,
    FormulaStep,
    YearlyProjection,
)

POLICY_CATALOG = {
    "drone_cadastral_svamitva": {
        "name": "SVAMITVA Drone Cadastral Demarcation & Digital Property Cards",
        "description": "High-precision drone survey with CORS network establishing unequivocal parcel boundaries and issuing digitized property cards.",
        "boundary_dispute_reduction": 0.65,
        "mutation_dispute_reduction": 0.20,
        "resolution_speedup_factor": 0.25,
        "economic_unlock_per_ha_lakhs": 14.5,
    },
    "fast_track_tribunal": {
        "name": "Fast-Track Land Dispute Tribunals & Revenue Court Modernization",
        "description": "Establishment of dedicated summary-procedure administrative tribunals with statutory 120-day maximum disposal mandates.",
        "boundary_dispute_reduction": 0.15,
        "mutation_dispute_reduction": 0.35,
        "resolution_speedup_factor": 0.55,
        "economic_unlock_per_ha_lakhs": 9.2,
    },
    "auto_mutation_blockchain": {
        "name": "Instant SRO-Tehsil API Auto-Mutation & Digital RoR Sync",
        "description": "Real-time algorithmic synchronization between Sub-Registrar deed execution and computerized Tehsil 7/12 / RTC records, eliminating manual mutation delays.",
        "boundary_dispute_reduction": 0.10,
        "mutation_dispute_reduction": 0.82,
        "resolution_speedup_factor": 0.38,
        "economic_unlock_per_ha_lakhs": 18.0,
    },
    "community_lok_adalat": {
        "name": "Village-Level Community Mediation & Lok Adalat Mobile Units",
        "description": "Gram Sabha partnered alternative dispute resolution (ADR) panels to amicably settle intrafamily inheritance and easement disputes.",
        "boundary_dispute_reduction": 0.40,
        "mutation_dispute_reduction": 0.45,
        "resolution_speedup_factor": 0.42,
        "economic_unlock_per_ha_lakhs": 8.0,
    },
    "title_guarantee_act": {
        "name": "Conclusive Land Titling Act with State Indemnity Guarantee (Torrens Model)",
        "description": "Transition from presumptive deed registration to state-guaranteed conclusive title certification with statutory Title Indemnification Fund.",
        "boundary_dispute_reduction": 0.75,
        "mutation_dispute_reduction": 0.88,
        "resolution_speedup_factor": 0.62,
        "economic_unlock_per_ha_lakhs": 24.5,
    },
}

def run_policy_simulation(db: Session, req: SimulationRequest) -> SimulationResultResponse:
    # 1. Fetch District Baseline or National Archetype
    district = None
    if req.district_id:
        district = db.query(District).filter(District.id == req.district_id).first()

    if not district:
        # Default representative archetype (composite district)
        district_name = "Composite Model District"
        base_active_disputes = 4200
        base_avg_days = 490.0
        base_digitized_pct = 72.0
        base_cadastral_pct = 68.0
        base_area_sqkm = 4500.0
    else:
        district_name = f"{district.name} ({district.state})"
        base_active_disputes = district.active_disputes_count
        base_avg_days = district.avg_resolution_days
        base_digitized_pct = district.digitized_records_pct
        base_cadastral_pct = district.cadastral_accuracy_pct
        base_area_sqkm = district.total_land_area_sqkm

    policy_meta = POLICY_CATALOG.get(req.policy_type, POLICY_CATALOG["drone_cadastral_svamitva"])
    cov_ratio = req.target_coverage_pct / 100.0
    years = req.implementation_years
    tech_factor = req.digitization_investment_factor

    # 2. Transparent Mathematical Formulas Step-by-Step
    formula_steps: List[FormulaStep] = []

    # Step 1: Effective Policy Intervention Power
    effective_power = min(0.95, cov_ratio * (0.7 + 0.3 * tech_factor))
    formula_steps.append(
        FormulaStep(
            step_name="1. Effective Policy Intervention Coefficient",
            target_variable="E_power",
            formula="E_power = min(0.95, Coverage_Ratio * (0.7 + 0.3 * Tech_Multiplier))",
            values_used=f"Coverage_Ratio = {cov_ratio:.2f}, Tech_Multiplier = {tech_factor:.2f}",
            calculated_output=f"{effective_power:.3f}",
            rationale="Accounts for diminishing returns when technology adoption or ground surveyor staffing factor is constrained.",
        )
    )

    # Step 2: Annual Dispute Prevention Rate
    weighted_reduction = (
        policy_meta["boundary_dispute_reduction"] * 0.45 +
        policy_meta["mutation_dispute_reduction"] * 0.55
    )
    dispute_prevention_pct = round(effective_power * weighted_reduction * 100.0, 1)
    formula_steps.append(
        FormulaStep(
            step_name="2. Annual Dispute Prevention Rate",
            target_variable="Δ_Dispute_Inflow",
            formula="Δ_Dispute_Inflow = E_power * [0.45 * Boundary_Reduct + 0.55 * Mutation_Reduct]",
            values_used=f"Boundary_Reduct = {policy_meta['boundary_dispute_reduction']:.2f}, Mutation_Reduct = {policy_meta['mutation_dispute_reduction']:.2f}",
            calculated_output=f"-{dispute_prevention_pct}% new disputes/yr",
            rationale="Weighted reduction across cadastral boundary inaccuracies and mutation delay triggers.",
        )
    )

    # Step 3: Resolution Speedup & Days Slashed
    res_speedup = min(0.70, effective_power * policy_meta["resolution_speedup_factor"])
    proj_avg_days = round(base_avg_days * (1.0 - res_speedup), 0)
    days_saved = int(base_avg_days - proj_avg_days)
    formula_steps.append(
        FormulaStep(
            step_name="3. Resolution Duration Acceleration",
            target_variable="T_resolved",
            formula="T_resolved = Base_Avg_Days * (1 - (E_power * Speedup_Factor))",
            values_used=f"Base_Avg_Days = {base_avg_days} days, Speedup_Factor = {policy_meta['resolution_speedup_factor']:.2f}",
            calculated_output=f"{int(proj_avg_days)} days (Reduction of {days_saved} days)",
            rationale="Simulates elimination of physical summoning delays and clear evidentiary boundary proof in proceedings.",
        )
    )

    # Step 4: Active Backlog Clearance over Timeline
    annual_resolution_boost = 1.0 + (res_speedup * 1.2)
    base_annual_inflow = int(base_active_disputes * 0.22)
    base_annual_outflow = int(base_active_disputes * 0.16)

    # Step 5: Economic Value Unlocked
    proj_backlog = int(base_active_disputes * (1.0 - (effective_power * 0.58)))
    net_cases_prevented_or_cleared = base_active_disputes - proj_backlog
    econ_unlocked_crores = round(
        (net_cases_prevented_or_cleared * 1.2 * policy_meta["economic_unlock_per_ha_lakhs"]) / 100.0,
        2
    )
    formula_steps.append(
        FormulaStep(
            step_name="4. Unlocked Land Market Capitalization",
            target_variable="V_unlocked",
            formula="V_unlocked = [Net_Cleared_Cases * Avg_Parcel_Ha * Value_Multiplier] / 100",
            values_used=f"Net_Cleared_Cases = {net_cases_prevented_or_cleared}, Value_Multiplier = ₹{policy_meta['economic_unlock_per_ha_lakhs']} Lakhs/ha",
            calculated_output=f"₹{econ_unlocked_crores} Crores",
            rationale="Unlocks collateralized credit eligibility, reduces dead capital from injuncted parcels, and enables formal bank mortgages.",
        )
    )

    # 3. Multi-Year Trajectory
    yearly_timeline: List[YearlyProjection] = []
    current_backlog = base_active_disputes
    for yr_idx in range(1, years + 1):
        year_cov = min(req.target_coverage_pct, (req.target_coverage_pct / years) * yr_idx)
        inflow = int(base_annual_inflow * (1.0 - (dispute_prevention_pct / 100.0) * (yr_idx / years)))
        outflow = int(base_annual_outflow * (1.0 + res_speedup * (yr_idx / years)))
        current_backlog = max(200, current_backlog + inflow - outflow)
        yr_avg_days = round(base_avg_days - (days_saved * (yr_idx / years)), 0)
        yr_econ = round((econ_unlocked_crores / years) * yr_idx, 2)

        yearly_timeline.append(
            YearlyProjection(
                year=yr_idx,
                year_label=f"Year {yr_idx} ({2025 + yr_idx})",
                coverage_achieved_pct=round(year_cov, 1),
                new_disputes_filed=inflow,
                disputes_resolved=outflow,
                backlog_pending=current_backlog,
                avg_resolution_days=yr_avg_days,
                economic_value_unlocked_crores=yr_econ,
            )
        )

    # 4. Result Package
    baseline = {
        "district_name": district_name,
        "active_disputes_backlog": base_active_disputes,
        "avg_resolution_days": base_avg_days,
        "digitized_records_pct": base_digitized_pct,
        "cadastral_accuracy_pct": base_cadastral_pct,
        "annual_disputes_filed": base_annual_inflow,
    }

    projected = {
        "active_disputes_backlog": proj_backlog,
        "avg_resolution_days": proj_avg_days,
        "digitized_records_pct": min(100.0, round(base_digitized_pct + (100.0 - base_digitized_pct) * cov_ratio * 0.85, 1)),
        "cadastral_accuracy_pct": min(98.5, round(base_cadastral_pct + (100.0 - base_cadastral_pct) * cov_ratio * 0.90, 1)),
        "annual_disputes_filed": yearly_timeline[-1].new_disputes_filed,
    }

    net_impact = {
        "backlog_reduction_pct": round(((base_active_disputes - proj_backlog) / base_active_disputes) * 100.0, 1),
        "days_saved_per_case": days_saved,
        "resolution_speedup_pct": round((days_saved / base_avg_days) * 100.0, 1),
        "total_disputes_prevented_or_cleared": net_cases_prevented_or_cleared,
        "economic_capital_unlocked_crores": econ_unlocked_crores,
        "benefit_to_cost_ratio": round((econ_unlocked_crores / max(1.0, req.budget_allocated_crores)), 2),
    }

    recommendations = [
        f"Prioritize Roll-out in Sub-Districts with >{round(base_avg_days, 0)} days dispute turnaround.",
        "Establish statutory SOP: Require mandatory e-mutation objection SMS notice prior to civil court filing.",
        "Link drone survey ortho-rectified maps directly to BhuNaksha GIS server to prevent duplicate survey orders.",
        "Empower Revenue Officers with summary disposal powers for boundary ridge disputes under ₹25 Lakhs.",
    ]

    risks = [
        {
            "risk": "Survey Ground-Truthing Bottleneck",
            "mitigation": "Deploy Gram Panchayat surveyor youth cadres (Ameens) with GNSS rovers under performance incentives.",
        },
        {
            "risk": "Resistance from Vested Intermediaries",
            "mitigation": "Provide public transparency kiosk in Tehsils showing live digitized mutation waitlists.",
        },
    ]

    return SimulationResultResponse(
        simulation_id=f"SIM-{uuid.uuid4().hex[:8].upper()}",
        policy_name=policy_meta["name"],
        policy_description=policy_meta["description"],
        parameters={
            "target_coverage_pct": req.target_coverage_pct,
            "implementation_years": req.implementation_years,
            "budget_allocated_crores": req.budget_allocated_crores,
            "digitization_investment_factor": req.digitization_investment_factor,
        },
        baseline=baseline,
        projected=projected,
        net_impact=net_impact,
        formulas_applied=formula_steps,
        timeline_projections=yearly_timeline,
        policy_recommendations=recommendations,
        risks_and_mitigations=risks,
    )
