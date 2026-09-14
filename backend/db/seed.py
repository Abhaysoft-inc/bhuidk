import json
import sys
from pathlib import Path

# Ensure backend directory is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from sqlalchemy.orm import Session
from db.engine import SessionLocal, engine
from db.base import Base
from models.user import User
from models.district import District
from models.document import Document
from models.citation import Citation
from models.dispute import Dispute
from services.auth_service import get_password_hash

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def seed_database(db: Session = None):
    close_db = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_db = True

    try:
        # 1. Seed Users (All 5 roles)
        existing_users_count = db.query(User).count()
        if existing_users_count == 0:
            demo_users = [
                {
                    "email": "admin@landgov.gov.in",
                    "full_name": "Admin Director",
                    "role": "Admin",
                    "organization": "National Land Information System",
                    "designation": "Principal System Administrator",
                    "password": "admin123",
                },
                {
                    "email": "researcher@iitb.ac.in",
                    "full_name": "Dr. Ananya Sharma",
                    "role": "Researcher",
                    "organization": "IIT Bombay - Centre for Policy Research",
                    "designation": "Associate Professor",
                    "password": "researcher123",
                },
                {
                    "email": "policymaker@niti.gov.in",
                    "full_name": "Rajiv Nambiar",
                    "role": "Policymaker",
                    "organization": "NITI Aayog Land Governance Division",
                    "designation": "Joint Advisor",
                    "password": "policy123",
                },
                {
                    "email": "official@nic.in",
                    "full_name": "Sunita Verma",
                    "role": "Government Official",
                    "organization": "Ministry of Panchayati Raj / Survey of India",
                    "designation": "Director (SVAMITVA Mission)",
                    "password": "official123",
                },
                {
                    "email": "citizen@example.com",
                    "full_name": "Vikram Patel",
                    "role": "Public User",
                    "organization": "Landowner / Citizen",
                    "designation": "Individual Farmer",
                    "password": "citizen123",
                },
            ]
            for u in demo_users:
                user_obj = User(
                    email=u["email"],
                    hashed_password=get_password_hash(u["password"]),
                    full_name=u["full_name"],
                    role=u["role"],
                    organization=u["organization"],
                    designation=u["designation"],
                    is_active=True,
                )
                db.add(user_obj)
            db.commit()
            print(" Seeded 5 standard role users.")

        # 2. Seed Districts
        if db.query(District).count() == 0:
            districts_file = DATA_DIR / "districts.json"
            if districts_file.exists():
                with open(districts_file, "r", encoding="utf-8") as f:
                    districts_data = json.load(f)
                for d in districts_data:
                    dist_obj = District(
                        code=d["code"],
                        name=d["name"],
                        state=d["state"],
                        state_code=d["state_code"],
                        total_land_area_sqkm=d.get("total_land_area_sqkm", 0),
                        rural_population=d.get("rural_population", 0),
                        urban_population=d.get("urban_population", 0),
                        digitized_records_pct=d.get("digitized_records_pct", 70.0),
                        cadastral_accuracy_pct=d.get("cadastral_accuracy_pct", 70.0),
                        active_disputes_count=d.get("active_disputes_count", 1000),
                        avg_resolution_days=d.get("avg_resolution_days", 450.0),
                        tribunal_active=d.get("tribunal_active", False),
                    )
                    db.add(dist_obj)
                db.commit()
                print(f" Seeded {len(districts_data)} districts.")

        # 3. Seed Documents & Citations
        if db.query(Document).count() == 0:
            docs_file = DATA_DIR / "documents.json"
            if docs_file.exists():
                with open(docs_file, "r", encoding="utf-8") as f:
                    docs_data = json.load(f)

                # Store raw citations to insert after all docs are inserted
                citation_links = []

                for item in docs_data:
                    doc = Document(
                        id=item["id"],
                        title=item["title"],
                        document_number=item.get("document_number"),
                        type=item["type"],
                        ministry=item["ministry"],
                        state=item.get("state", "National"),
                        year=item["year"],
                        date_published=item.get("date_published"),
                        summary=item["summary"],
                        full_text=item["full_text"],
                        key_clauses=item.get("key_clauses"),
                        tags=item.get("tags"),
                        file_url=item.get("file_url"),
                        file_size=item.get("file_size"),
                        page_count=item.get("page_count"),
                    )
                    db.add(doc)

                    # Gather citations
                    for cit in item.get("citations", []):
                        citation_links.append({
                            "source_doc_id": item["id"],
                            "target_doc_id": cit["target_doc_id"],
                            "citation_type": cit.get("citation_type", "references"),
                            "section_reference": cit.get("section_reference"),
                            "context_snippet": cit.get("context_snippet"),
                        })

                db.commit()
                print(f" Seeded {len(docs_data)} documents.")

                # Insert citation links
                for cit in citation_links:
                    c_obj = Citation(
                        source_doc_id=cit["source_doc_id"],
                        target_doc_id=cit["target_doc_id"],
                        citation_type=cit["citation_type"],
                        section_reference=cit["section_reference"],
                        context_snippet=cit["context_snippet"],
                    )
                    db.add(c_obj)
                db.commit()
                print(f" Seeded {len(citation_links)} citation links.")

        # 4. Seed Disputes
        if db.query(Dispute).count() == 0:
            disputes_file = DATA_DIR / "disputes.json"
            if disputes_file.exists():
                with open(disputes_file, "r", encoding="utf-8") as f:
                    disputes_data = json.load(f)

                district_map = {d.code: d.id for d in db.query(District).all()}

                for item in disputes_data:
                    dist_id = district_map.get(item["district_code"])
                    if dist_id:
                        disp = Dispute(
                            district_id=dist_id,
                            case_number=item["case_number"],
                            dispute_type=item["dispute_type"],
                            primary_cause=item["primary_cause"],
                            filing_year=item["filing_year"],
                            filing_date=item["filing_date"],
                            resolution_date=item.get("resolution_date"),
                            status=item["status"],
                            resolution_days=item.get("resolution_days"),
                            claimed_area_hectares=item.get("claimed_area_hectares", 1.0),
                            financial_impact_lakhs=item.get("financial_impact_lakhs", 15.0),
                            summary=item.get("summary"),
                        )
                        db.add(disp)

                # Generate additional representative disputes to allow deep analytics per district
                cause_pool = [
                    "Record Mismatch / Mutation Delay",
                    "Unclear Boundary Survey",
                    "Fraudulent Double Registration",
                    "Compensation Disagreement",
                    "Intrafamily Inheritance Disparity",
                    "Common Land Encroachment",
                ]
                type_pool = [
                    "Title & Ownership",
                    "Boundary / Encroachment",
                    "Inheritance & Succession",
                    "Compulsory Land Acquisition",
                    "Tenancy & Mutation",
                    "Easement Rights",
                ]

                all_dists = db.query(District).all()
                counter = 2000
                for d in all_dists:
                    for yr in [2020, 2021, 2022, 2023, 2024]:
                        for i in range(4):
                            counter += 1
                            cause = cause_pool[(counter + i) % len(cause_pool)]
                            dtype = type_pool[(counter + i * 2) % len(type_pool)]
                            is_res = yr <= 2022 or (yr == 2023 and i % 2 == 0)
                            status = "Resolved" if is_res else ("Pending" if i % 2 == 0 else "Appealed / High Court")
                            res_days = int(d.avg_resolution_days * (0.8 + 0.4 * (i % 3))) if is_res else None

                            extra_disp = Dispute(
                                district_id=d.id,
                                case_number=f"{d.state_code}-{d.code[:3]}-{yr}-{counter}",
                                dispute_type=dtype,
                                primary_cause=cause,
                                filing_year=yr,
                                filing_date=f"{yr}-0{i+1}-15",
                                resolution_date=f"{yr+1}-05-20" if is_res else None,
                                status=status,
                                resolution_days=res_days,
                                claimed_area_hectares=round(0.5 + (counter % 10) * 0.4, 2),
                                financial_impact_lakhs=round(10.0 + (counter % 30) * 3.5, 1),
                                summary=f"Dispute involving {dtype.lower()} due to {cause.lower()} in block {i+1}.",
                            )
                            db.add(extra_disp)

                db.commit()
                print(" Seeded disputes across all districts.")

    finally:
        if close_db:
            db.close()

if __name__ == "__main__":
    seed_database()
