from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.config import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title='NaufalRF Contextual RAG Service',
        version='0.1.0',
        docs_url='/docs',
        redoc_url='/redoc',
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=['GET', 'POST', 'OPTIONS'],
        allow_headers=['Content-Type', 'Authorization', 'X-Service-Token'],
        allow_credentials=False,
    )

    app.include_router(api_router)
    return app


app = create_app()
