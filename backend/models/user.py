from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="Researcher")  # Researcher, Policymaker, Government Official, Public User, Admin
    organization = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
