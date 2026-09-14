from routers.auth import router as auth_router
from routers.documents import router as documents_router
from routers.search import router as search_router
from routers.districts import router as districts_router
from routers.simulation import router as simulation_router

__all__ = [
    "auth_router",
    "documents_router",
    "search_router",
    "districts_router",
    "simulation_router",
]
