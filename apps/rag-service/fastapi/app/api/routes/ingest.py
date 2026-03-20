from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import require_service_token
from app.api.responses import error_response, success_response
from app.db.session import get_async_session
from app.schemas.ingest import IngestRequest
from app.services.errors import RagServiceError
from app.services.ingest_service import IngestService

router = APIRouter(tags=["ingest"])
session_dependency = Depends(get_async_session)


@router.post("/ingest", dependencies=[Depends(require_service_token)])
async def ingest(request: IngestRequest, session: AsyncSession = session_dependency):
    service = IngestService(session)
    try:
        response = await service.ingest(request)
        return success_response(response.model_dump(mode="json", by_alias=True))
    except ValueError as exc:
        return error_response(str(exc), 400, "INGEST_REQUEST_INVALID")
    except RagServiceError as exc:
        return error_response(exc.message, exc.status_code, exc.code)
    except HTTPException as exc:
        detail = (
            exc.detail
            if isinstance(exc.detail, dict)
            else {"message": str(exc.detail), "code": "INGEST_ERROR"}
        )
        return error_response(
            detail["message"], exc.status_code, detail.get("code", "INGEST_ERROR")
        )
