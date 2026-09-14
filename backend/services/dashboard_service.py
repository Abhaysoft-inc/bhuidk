from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from models.district import District
from models.dispute import Dispute
from schemas.dashboard import (
    DistrictItem,
    DistrictDashboardResponse,
    DisputeTrendPoint,
    CauseBreakdownItem,
    DisputeTypeBreakdownItem,
    BenchmarkMetric,
)

NATIONAL_AVG_RESOLUTION_DAYS = 485.0
NATIONAL_AVG_DIGITIZATION_PCT = 78.4

def get_all_districts(db: Session) -> List[DistrictItem]:
    districts = db.query(District).order_by(District.name).all()
    return [DistrictItem.model_validate(d) for d in districts]

def get_district_dashboard_data(db: Session, district_id: int) -> Optional[DistrictDashboardResponse]:
    district = db.query(District).filter(District.id == district_id).first()
    if not district:
        return None

    # Fetch all disputes for this district
    disputes = db.query(Dispute).filter(Dispute.district_id == district.id).all()

    # Calculate State Average for benchmark
    state_districts = db.query(District).filter(District.state == district.state).all()
    state_avg_res_days = (
        sum(d.avg_resolution_days for d in state_districts) / len(state_districts)
        if state_districts else NATIONAL_AVG_RESOLUTION_DAYS
    )
    state_avg_digitization = (
        sum(d.digitized_records_pct for d in state_districts) / len(state_districts)
        if state_districts else NATIONAL_AVG_DIGITIZATION_PCT
    )

    total_disputes = len(disputes)
    resolved_disputes = [d for d in disputes if d.status == "Resolved"]
    pending_disputes = [d for d in disputes if d.status != "Resolved"]
    total_financial_lakhs = sum(d.financial_impact_lakhs for d in disputes)
    total_financial_crores = round(total_financial_lakhs / 100.0, 2)

    # 1. Dispute Trend by Year (2020 - 2024)
    trend_points: List[DisputeTrendPoint] = []
    cumulative_pending = 0
    for yr in [2020, 2021, 2022, 2023, 2024]:
        yr_filed = len([d for d in disputes if d.filing_year == yr])
        yr_resolved = len([d for d in disputes if d.filing_year == yr and d.status == "Resolved"])
        net_change = yr_filed - yr_resolved
        cumulative_pending = max(0, cumulative_pending + net_change)
        trend_points.append(
            DisputeTrendPoint(
                year=yr,
                filed=yr_filed,
                resolved=yr_resolved,
                pending_end_of_year=cumulative_pending + int(district.active_disputes_count * 0.18),
            )
        )

    # 2. Cause Breakdown
    cause_map: Dict[str, Dict[str, Any]] = {}
    for d in disputes:
        c = d.primary_cause
        if c not in cause_map:
            cause_map[c] = {"count": 0, "res_days_sum": 0, "res_days_count": 0, "total_value": 0.0}
        cause_map[c]["count"] += 1
        cause_map[c]["total_value"] += d.financial_impact_lakhs
        if d.resolution_days:
            cause_map[c]["res_days_sum"] += d.resolution_days
            cause_map[c]["res_days_count"] += 1

    cause_items: List[CauseBreakdownItem] = []
    denom = total_disputes if total_disputes > 0 else 1
    for cause_name, info in cause_map.items():
        cnt = info["count"]
        pct = round((cnt / denom) * 100.0, 1)
        avg_days = round(info["res_days_sum"] / info["res_days_count"], 0) if info["res_days_count"] > 0 else district.avg_resolution_days
        cause_items.append(
            CauseBreakdownItem(
                cause=cause_name,
                count=cnt,
                percentage=pct,
                avg_resolution_days=avg_days,
                total_value_lakhs=round(info["total_value"], 1),
            )
        )
    cause_items.sort(key=lambda x: x.count, reverse=True)

    # 3. Dispute Type Breakdown
    type_map: Dict[str, int] = {}
    for d in disputes:
        t = d.dispute_type
        type_map[t] = type_map.get(t, 0) + 1

    type_items: List[DisputeTypeBreakdownItem] = []
    for t_name, cnt in type_map.items():
        type_items.append(
            DisputeTypeBreakdownItem(
                type=t_name,
                count=cnt,
                percentage=round((cnt / denom) * 100.0, 1),
            )
        )
    type_items.sort(key=lambda x: x.count, reverse=True)

    # 4. Benchmarks
    diff_days = district.avg_resolution_days - NATIONAL_AVG_RESOLUTION_DAYS
    if diff_days < 0:
        res_comp_text = f"{abs(int(diff_days))} days faster than National Average"
    else:
        res_comp_text = f"{int(diff_days)} days slower than National Average"

    benchmarks = {
        "resolution_days": BenchmarkMetric(
            district_value=district.avg_resolution_days,
            state_avg=round(state_avg_res_days, 1),
            national_avg=NATIONAL_AVG_RESOLUTION_DAYS,
            comparison_text=res_comp_text,
        ),
        "digitization_percentage": BenchmarkMetric(
            district_value=district.digitized_records_pct,
            state_avg=round(state_avg_digitization, 1),
            national_avg=NATIONAL_AVG_DIGITIZATION_PCT,
            comparison_text=f"{'+' if district.digitized_records_pct >= NATIONAL_AVG_DIGITIZATION_PCT else ''}{round(district.digitized_records_pct - NATIONAL_AVG_DIGITIZATION_PCT, 1)}% vs National Baseline",
        ),
    }

    # 5. KPIs
    kpis = {
        "active_disputes_count": district.active_disputes_count,
        "avg_resolution_days": district.avg_resolution_days,
        "sample_disputes_tracked": total_disputes,
        "digitized_records_pct": district.digitized_records_pct,
        "cadastral_accuracy_pct": district.cadastral_accuracy_pct,
        "tribunal_active": district.tribunal_active,
        "total_financial_exposure_crores": total_financial_crores,
        "top_root_cause": cause_items[0].cause if cause_items else "Record Mismatch",
    }

    # 6. Recent Cases
    recent_cases = [
        {
            "case_number": d.case_number,
            "dispute_type": d.dispute_type,
            "primary_cause": d.primary_cause,
            "filing_date": d.filing_date,
            "status": d.status,
            "claimed_area_ha": d.claimed_area_hectares,
            "financial_lakhs": d.financial_impact_lakhs,
        }
        for d in disputes[:6]
    ]

    return DistrictDashboardResponse(
        district=DistrictItem.model_validate(district),
        kpis=kpis,
        dispute_trends=trend_points,
        cause_breakdown=cause_items,
        dispute_type_breakdown=type_items,
        benchmarks=benchmarks,
        recent_cases=recent_cases,
    )
