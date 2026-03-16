from typing import Annotated

from fastapi import Header, HTTPException, status

from app.api.responses import detail_from_exception
from app.config import settings


async def require_service_token(
    x_service_token: Annotated[str | None, Header(alias='X-Service-Token')] = None,
) -> None:
    if not settings.admin_service_token:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=detail_from_exception(
                'ADMIN_SERVICE_TOKEN is not configured for the FastAPI service.',
                'ADMIN_SERVICE_TOKEN_NOT_CONFIGURED',
            ),
        )

    if x_service_token != settings.admin_service_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail_from_exception('Invalid service token.', 'INVALID_SERVICE_TOKEN'),
        )
