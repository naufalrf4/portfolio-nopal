from google import genai
from google.genai import types as genai_types

from app.config import settings
from app.services.errors import RagServiceError


class EmbeddingService:
    def __init__(self) -> None:
        self._client = (
            genai.Client(api_key=settings.gemini_api_key) if settings.gemini_api_key else None
        )

    async def embed_texts(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []

        if self._client is None:
            raise RagServiceError(
                "GEMINI_API_KEY is not configured.", "GEMINI_API_KEY_NOT_CONFIGURED", 503
            )

        all_embeddings: list[list[float]] = []
        client = self._client.aio
        for start in range(0, len(texts), settings.ingestion_batch_size):
            batch = texts[start : start + settings.ingestion_batch_size]
            response = await client.models.embed_content(
                model=settings.embedding_model,
                contents=batch,
                config=genai_types.EmbedContentConfig(
                    output_dimensionality=settings.embedding_dimension,
                ),
            )

            embeddings = getattr(response, "embeddings", None)
            if embeddings:
                all_embeddings.extend(list(item.values) for item in embeddings)
                continue

            single_embedding = getattr(response, "embedding", None)
            if single_embedding is not None:
                all_embeddings.append(list(single_embedding.values))
                continue

            raise RagServiceError(
                "Embedding response did not contain vectors.",
                "EMBEDDING_RESPONSE_INVALID",
                502,
            )

        return all_embeddings
