from uuid import UUID

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    session_id: UUID | None = Field(default=None, alias='sessionId')

    model_config = {'populate_by_name': True}


class ChatResponse(BaseModel):
    session_id: UUID = Field(alias='sessionId')
    message: str
    sources: list[str]
    metadata: dict[str, object]

    model_config = {'populate_by_name': True}
