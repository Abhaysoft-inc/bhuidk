from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from db.base import Base

class Dispute(Base):
    __tablename__ = "disputes"

    id = Column(Integer, primary_key=True, index=True)
    district_id = Column(Integer, ForeignKey("districts.id", ondelete="CASCADE"), nullable=False)
    case_number = Column(String, unique=True, index=True, nullable=False)
    
    # Types: Title & Ownership, Boundary / Encroachment, Inheritance & Succession,
    #        Compulsory Land Acquisition, Tenancy & Mutation, Easement Rights
    dispute_type = Column(String, index=True, nullable=False)
    
    # Root Cause: Record Mismatch / Mutation Delay, Unclear Boundary Survey,
    #             Fraudulent Double Registration, Compensation Disagreement,
    #             Intrafamily Inheritance Disparity, Common Land Encroachment
    primary_cause = Column(String, index=True, nullable=False)
    
    filing_year = Column(Integer, index=True, nullable=False)
    filing_date = Column(String, nullable=False)
    resolution_date = Column(String, nullable=True)
    
    # Status: Pending, Resolved, Appealed / High Court, Mediation in Progress
    status = Column(String, index=True, nullable=False, default="Pending")
    resolution_days = Column(Integer, nullable=True)
    
    claimed_area_hectares = Column(Float, default=1.0)
    financial_impact_lakhs = Column(Float, default=10.0)  # INR in Lakhs
    summary = Column(Text, nullable=True)

    # Relationships
    district = relationship("District", back_populates="disputes")
