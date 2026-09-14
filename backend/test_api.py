import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_full_pipeline():
    print("\n" + "="*60)
    print("[RUNNING] FULL LAND GOVERNANCE BACKEND TEST SUITE")
    print("="*60 + "\n")

    # 1. Health
    res = client.get("/health")
    assert res.status_code == 200, f"Health failed: {res.text}"
    print(f"[PASS] 1. Health Check passed: {res.json()['status']}")

    # 2. Auth Login
    res = client.post("/api/auth/login", json={"email": "admin@landgov.gov.in", "password": "admin123"})
    assert res.status_code == 200, f"Login failed: {res.text}"
    token = res.json()["access_token"]
    user = res.json()["user"]
    print(f"[PASS] 2. Auth Login passed: {user['full_name']} ({user['role']})")

    # 3. Auth Me
    headers = {"Authorization": f"Bearer {token}"}
    res = client.get("/api/auth/me", headers=headers)
    assert res.status_code == 200, f"Auth Me failed: {res.text}"
    print(f"[PASS] 3. Protected /auth/me passed: {res.json()['email']}")

    # 4. Document Filters
    res = client.get("/api/documents/filters")
    assert res.status_code == 200, f"Filters failed: {res.text}"
    filters = res.json()
    print(f"[PASS] 4. Document Filters fetched: {len(filters['types'])} types, {len(filters['ministries'])} ministries, {filters['total_count']} total documents")

    # 5. Document List & Filter
    res = client.get("/api/documents?type=Act / Legislation")
    assert res.status_code == 200, f"Docs list failed: {res.text}"
    docs = res.json()["items"]
    print(f"[PASS] 5. Document Filtering passed: retrieved {len(docs)} Acts")

    # 6. Document Detail & Backlinks
    res = client.get("/api/documents/1")
    assert res.status_code == 200, f"Doc detail failed: {res.text}"
    doc_detail = res.json()
    print(f"[PASS] 6. Document Detail passed: '{doc_detail['title'][:40]}...'")
    print(f"   -> Citations Made: {len(doc_detail['citations_made'])}, Cited In (Backlinks): {len(doc_detail['cited_by'])}")

    # 7. Search & Synthesis Q&A
    res = client.post("/api/search/query", json={"query": "What are the rules for land acquisition lapse under Section 24?"})
    assert res.status_code == 200, f"Search failed: {res.text}"
    synthesis = res.json()
    print(f"[PASS] 7. Search & Synthesis Q&A passed (Confidence: {synthesis['grounding_confidence']*100}%):")
    print(f"   -> Grounded Answer snippet: {synthesis['answer'][:120]}...")
    print(f"   -> Grounded Citations count: {len(synthesis['citations'])}")

    # 8. Districts List
    res = client.get("/api/districts")
    assert res.status_code == 200, f"Districts list failed: {res.text}"
    districts = res.json()
    print(f"[PASS] 8. Districts List passed: {len(districts)} districts available")

    # 9. District Dashboard
    target_dist_id = districts[0]["id"]
    res = client.get(f"/api/districts/{target_dist_id}/dashboard")
    assert res.status_code == 200, f"District dashboard failed: {res.text}"
    dash = res.json()
    print(f"[PASS] 9. District Dashboard passed for {dash['district']['name']}:")
    print(f"   -> Active Disputes: {dash['kpis']['active_disputes_count']}, Avg Resolution: {dash['kpis']['avg_resolution_days']} days")
    print(f"   -> Top Root Cause: {dash['kpis']['top_root_cause']}")
    print(f"   -> 5-Year Trends: {len(dash['dispute_trends'])} trend points, Causes: {len(dash['cause_breakdown'])} categories")

    # 10. Reform Simulation Sandbox
    sim_payload = {
        "policy_type": "drone_cadastral_svamitva",
        "district_id": target_dist_id,
        "target_coverage_pct": 85.0,
        "implementation_years": 3,
        "budget_allocated_crores": 30.0,
        "digitization_investment_factor": 1.2
    }
    res = client.post("/api/simulation/run", json=sim_payload)
    assert res.status_code == 200, f"Simulation failed: {res.text}"
    sim = res.json()
    print(f"[PASS] 10. Reform Simulation Sandbox passed:")
    print(f"   -> Policy: {sim['policy_name'][:45]}...")
    print(f"   -> Net Backlog Reduction: {sim['net_impact']['backlog_reduction_pct']}%")
    print(f"   -> Days Saved Per Case: {sim['net_impact']['days_saved_per_case']} days")
    print(f"   -> Economic Capital Unlocked: INR {sim['net_impact']['economic_capital_unlocked_crores']} Crores")
    print(f"   -> Transparent Formulas: {len(sim['formulas_applied'])} formula steps calculated")
    print(f"   -> Yearly Projections: {len(sim['timeline_projections'])} years modelled")

    print("\n" + "="*60)
    print("[SUCCESS] ALL 10 TEST PHASES PASSED WITH 100% SUCCESS!")
    print("="*60 + "\n")

if __name__ == "__main__":
    test_full_pipeline()
