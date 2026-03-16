from uuid import UUID

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    session_id: UUID | None = Field(default=None, alias="sessionId")

    model_config = {"populate_by_name": True}


class ChatCitation(BaseModel):
    source: str
    title: str | None = None
    route: str | None = None
    route_label: str | None = Field(default=None, alias="routeLabel")
    source_type: str | None = Field(default=None, alias="sourceType")
    source_ref: str | None = Field(default=None, alias="sourceRef")
    section: str | None = None

    model_config = {"populate_by_name": True}


class SuggestedAction(BaseModel):
    type: str
    target: str
    label: str


class ChatPublicMetadata(BaseModel):
    workflow: str
    intent: str
    query_language: str = Field(alias="queryLanguage")
    answer_language: str = Field(alias="answerLanguage")
    retrieval_confidence: float = Field(alias="retrievalConfidence")
    abstained: bool

    model_config = {"populate_by_name": True}


class ChatResponse(BaseModel):
    session_id: UUID = Field(alias="sessionId")
    message: str
    sources: list[str]
    citations: list[ChatCitation] = Field(default_factory=list)
    suggested_actions: list[SuggestedAction] = Field(default_factory=list, alias="suggestedActions")
    metadata: ChatPublicMetadata

    model_config = {"populate_by_name": True}
