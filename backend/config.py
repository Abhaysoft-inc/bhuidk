from pydantic import BaseModel, Field
from typing import List
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

class Settings(BaseModel):
    PROJECT_NAME: str = "Land Governance AI & Policy Sandbox API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Environment & Host
    ENV: str = os.getenv("ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "127.0.0.1")
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]
    
    # Database (Default to SQLite in backend root)
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/land_governance.db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "land-governance-super-secret-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # AI & Vector search
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    CHROMA_PERSIST_DIR: str = str(BASE_DIR / "chroma_db")
    
    # File Storage
    UPLOAD_DIR: str = str(BASE_DIR / "uploads")

settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
