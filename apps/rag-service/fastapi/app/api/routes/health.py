from fastapi import APIRouter
from pydantic import BaseModel

from app.config import settings

router = APIRouter(tags=['health'])


class HealthResponse(BaseModel):
    status: str
    mode: str
    service: str
    embedding_model: str
    embedding_dimension: int
    chat_model: str
    database_configured: bool
    admin_api_url: str


@router.get('/health', response_model=HealthResponse)
async def health_check() -> HealthResponse:
    return HealthResponse(
        status='ok',
        mode='batch-2',
        service='rag-service-fastapi',
        embedding_model=settings.embedding_model,
        embedding_dimension=settings.embedding_dimension,
        chat_model=settings.chat_model,
        database_configured=bool(settings.rag_database_url),
        admin_api_url=settings.admin_api_url,
    )
