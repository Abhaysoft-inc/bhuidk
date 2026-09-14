import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from config import settings
from db.engine import engine, SessionLocal
from db.base import Base
from db.seed import seed_database
import models  # Ensure all models are registered with Base.metadata

from routers.auth import router as auth_router
from routers.documents import router as documents_router
from routers.search import router as search_router
from routers.districts import router as districts_router
from routers.simulation import router as simulation_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("landgov_api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and seed data if not present
    logger.info("Initializing Land Governance Database...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        seed_database(db)
    except Exception as e:
        logger.error(f"Error during database seed: {e}")
    finally:
        db.close()
    
    logger.info(" Land Governance Backend ready on port %s", settings.PORT)
    yield
    logger.info("Shutting down Land Governance Backend...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Production-grade modular backend powering the National Land Governance, "
        "Policy Simulator, Document Library, and District Analytics Engine."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits all localhost and preview origins for seamless dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Uploads Directory
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Health Check
@app.get("/health", tags=["Health"])
@app.get(f"{settings.API_V1_STR}/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENV,
    }

# Register Feature Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(documents_router, prefix=settings.API_V1_STR)
app.include_router(search_router, prefix=settings.API_V1_STR)
app.include_router(districts_router, prefix=settings.API_V1_STR)
app.include_router(simulation_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=settings.PORT, reload=True)
