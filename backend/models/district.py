from sqlalchemy import Column, Integer, String, Float, Boolean
from sqlalchemy.orm import relationship
from db.base import Base

class District(Base):
    __tablename__ = "districts"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, index=True, nullable=False)
    state = Column(String, index=True, nullable=False)
    state_code = Column(String, index=True, nullable=False)
    
    total_land_area_sqkm = Column(Float, default=0.0)
    rural_population = Column(Integer, default=0)
    urban_population = Column(Integer, default=0)
    
    # Baseline Metrics
    digitized_records_pct = Column(Float, default=65.0)       # % of land records digitized
    cadastral_accuracy_pct = Column(Float, default=70.0)      # % mapped via drone/DGPS
    active_disputes_count = Column(Integer, default=0)
    avg_resolution_days = Column(Float, default=450.0)        # Average days to resolve a land dispute
    tribunal_active = Column(Boolean, default=False)
    
    # Relationships
    disputes = relationship("Dispute", back_populates="district", cascade="all, delete-orphan")
