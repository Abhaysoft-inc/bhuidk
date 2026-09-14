from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SignupRequest(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=6, description="Account password")
    full_name: str
    role: str = "Researcher"  # Researcher, Policymaker, Government Official, Public User, Admin
    organization: Optional[str] = None
    designation: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    organization: Optional[str] = None
    designation: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
