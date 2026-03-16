from typing import Literal

from pydantic import BaseModel, Field


class IngestRequest(BaseModel):
    type: Literal["knowledge", "project", "about", "all"]
    document_id: str | None = Field(default=None, alias="documentId")

    model_config = {"populate_by_name": True}


class IngestResponse(BaseModel):
    success: bool
    chunks_ingested: int = Field(alias="chunksIngested")
    source: str

    model_config = {"populate_by_name": True}
