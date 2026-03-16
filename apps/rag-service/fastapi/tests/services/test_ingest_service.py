import uuid

import pytest

from app.schemas.admin import ProjectContent, ProjectContext
from app.services.ingest_service import IngestedSource, IngestService


@pytest.mark.asyncio
async def test_ingest_project_document_prefers_project_content(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    service = IngestService.__new__(IngestService)

    captured: dict[str, object] = {}

    async def fake_ingest_text_document(**kwargs: object) -> IngestedSource:
        captured.update(kwargs)
        return IngestedSource(chunks_written=4, source="project:sample-project")

    service._ingest_text_document = fake_ingest_text_document

    project = ProjectContent(
        title="Sample Project",
        slug="sample-project",
        summary="Summary text",
        description="Description text",
        content="## Architecture\nThis is the real long-form project content.",
        techStack=["Next.js", "Postgres"],
        contexts=[
            ProjectContext(
                title="Legacy Context",
                content="This legacy context should not be used when content exists.",
            )
        ],
    )

    result = await IngestService._ingest_project_document(service, project, uuid.uuid4())

    assert result.chunks_written == 4
    text = str(captured["text"])
    assert "## Architecture\nThis is the real long-form project content." in text
    assert "This legacy context should not be used" not in text


@pytest.mark.asyncio
async def test_ingest_project_document_falls_back_to_legacy_contexts(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    service = IngestService.__new__(IngestService)

    captured: dict[str, object] = {}

    async def fake_ingest_text_document(**kwargs: object) -> IngestedSource:
        captured.update(kwargs)
        return IngestedSource(chunks_written=2, source="project:legacy-project")

    service._ingest_text_document = fake_ingest_text_document

    project = ProjectContent(
        title="Legacy Project",
        slug="legacy-project",
        summary="Summary text",
        description="Description text",
        content="",
        techStack=["Astro"],
        contexts=[
            ProjectContext(
                title="Role",
                content="Led architecture and delivery.",
            )
        ],
    )

    result = await IngestService._ingest_project_document(service, project, uuid.uuid4())

    assert result.chunks_written == 2
    text = str(captured["text"])
    assert "## Role\nLed architecture and delivery." in text
