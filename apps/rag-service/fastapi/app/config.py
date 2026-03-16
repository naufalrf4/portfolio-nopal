from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: str = Field(default="development", alias="APP_ENV")
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=3005, alias="PORT")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")

    rag_database_url: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/naufalrf_portfolio",
        alias="RAG_DATABASE_URL",
    )
    admin_api_url: str = Field(default="http://localhost:3001", alias="ADMIN_API_URL")
    admin_service_token: str = Field(default="", alias="ADMIN_SERVICE_TOKEN")

    gemini_api_key: str = Field(default="", alias="GEMINI_API_KEY")
    embedding_model: str = Field(default="gemini-embedding-001", alias="EMBEDDING_MODEL")
    embedding_dimension: int = Field(default=768, alias="EMBEDDING_DIMENSION")
    chat_model: str = Field(default="gemini-2.5-flash", alias="CHAT_MODEL")
    context_model: str = Field(default="gemini-2.5-flash", alias="CONTEXT_MODEL")
    admin_api_timeout_ms: int = Field(default=5000, alias="ADMIN_API_TIMEOUT_MS")

    cors_origins: list[str] = Field(
        default_factory=lambda: ["http://localhost:3000", "http://127.0.0.1:3000"],
        alias="CORS_ORIGINS",
    )
    chunk_target_tokens: int = Field(default=800, alias="CHUNK_TARGET_TOKENS")
    chunk_overlap_tokens: int = Field(default=120, alias="CHUNK_OVERLAP_TOKENS")
    ingestion_batch_size: int = Field(default=32, alias="INGESTION_BATCH_SIZE")
    retrieval_limit: int = Field(default=5, alias="RETRIEVAL_LIMIT")
    chat_history_limit: int = Field(default=6, alias="CHAT_HISTORY_LIMIT")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
