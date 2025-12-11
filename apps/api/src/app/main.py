from fastapi import FastAPI

from ..api.routers.v1 import router as v1_router
from ..config.settings import settings


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name)
    app.include_router(v1_router, prefix="/api/v1")
    return app


app = create_app()
