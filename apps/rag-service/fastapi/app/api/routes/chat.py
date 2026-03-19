from typing import Annotated, cast

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.responses import error_response, success_response
from app.db.session import get_async_session
from app.schemas.chat import ChatRequest
from app.services.chat_service import ChatService
from app.services.errors import RagServiceError

router = APIRouter(tags=["chat"])
SessionDep = Annotated[AsyncSession, Depends(get_async_session)]


@router.post("/chat")
async def chat(
    request: ChatRequest,
    http_request: Request,
    session: SessionDep,
):
    service = ChatService(session)
    preferred_language = http_request.headers.get("accept-language")
    try:
        response = await service.chat(request, preferred_language)
        return success_response(response.model_dump(mode="json", by_alias=True))
    except RagServiceError as exc:
        return error_response(exc.message, exc.status_code, exc.code)
    except HTTPException as exc:
        if isinstance(exc.detail, dict):
            detail = cast(dict[str, object], exc.detail)
            message = str(detail.get("message", "CHAT_ERROR"))
            code = str(detail.get("code", "CHAT_ERROR"))
        else:
            message = str(exc.detail)
            code = "CHAT_ERROR"
        return error_response(message, exc.status_code, code)
