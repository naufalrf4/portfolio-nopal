from app.schemas.admin import ChatLogMessage, ContentExport, FreelanceIntentContext
from app.schemas.chat import ChatRequest
from app.services.admin_client import AdminApiClient
from app.services.chat_service import ChatService
from app.services.embedding_service import EmbeddingService
from app.services.llm_service import GeneratedText, LlmService, QueryPlan
from app.services.repository import RagRepository, RetrievedChunk
from app.services.tool_service import ToolExecutionResult, ToolService


class StubAdminClient(AdminApiClient):
    def __init__(self, content_export: ContentExport | None = None) -> None:
        self.saved_messages: list[dict[str, object]] = []
        self.save_mode = "replace"
        self.content_export_calls = 0
        self.freelance_context_calls = 0
        self.content_export = content_export or ContentExport.model_validate(
            {
                "aboutMe": {"bio": "", "skills": [], "experience": []},
                "projects": [],
                "knowledgeDocs": [],
            }
        )

    async def get_chat_log(self, session_id: str) -> list[ChatLogMessage]:
        return []

    async def save_chat_log(
        self, session_id: str, messages: list[dict[str, object]], mode: str = "replace"
    ) -> None:
        self.saved_messages = messages
        self.save_mode = mode

    async def get_content_export(self) -> ContentExport:
        self.content_export_calls += 1
        return self.content_export

    async def get_freelance_intent_context(self) -> FreelanceIntentContext:
        self.freelance_context_calls += 1
        return FreelanceIntentContext(
            freelanceProfile=self.content_export.about_me.freelance_profile
        )


class StubEmbeddingService(EmbeddingService):
    async def embed_texts(self, texts: list[str]) -> list[list[float]]:
        return [[0.1, 0.2, 0.3] for _ in texts]


class StubRepository(RagRepository):
    def __init__(self, results: list[RetrievedChunk]) -> None:
        self.results = results

    async def search_chunks_hybrid(
        self,
        query_embedding: list[float],
        query_text: str,
        limit: int,
        visibilities: list[str],
    ) -> list[RetrievedChunk]:
        return self.results[:limit]


class StubToolService(ToolService):
    def __init__(self, result: ToolExecutionResult | None = None) -> None:
        self.execute_calls: list[dict[str, object]] = []
        self.result = result or ToolExecutionResult(
            tool_name="feature_pricing_quote",
            text="Tool output",
            context="Tool context",
            metadata={"status": "completed"},
        )

    def execute(
        self,
        tool_name: str,
        arguments: dict[str, object],
        question: str,
        answer_language: str = "en",
    ) -> ToolExecutionResult:
        self.execute_calls.append(
            {
                "tool_name": tool_name,
                "arguments": arguments,
                "question": question,
                "answer_language": answer_language,
            }
        )
        return self.result


class StubLlmService(LlmService):
    def __init__(self, query_plan: QueryPlan, answer: GeneratedText | None = None) -> None:
        self.query_plan = query_plan
        self.answer = answer
        self.answer_calls = 0

    async def analyze_query(self, prompt: str, fallback: dict[str, object]) -> QueryPlan:
        return self.query_plan

    async def answer_question(self, prompt: str) -> GeneratedText:
        self.answer_calls += 1
        if self.answer is None:
            raise AssertionError("answer_question should not run for abstained responses")
        return self.answer


async def test_chat_service_returns_grounded_english_answer() -> None:
    service = ChatService.__new__(ChatService)
    admin_client = StubAdminClient()
    repository = StubRepository(
        [
            RetrievedChunk(
                source="project:sample-project",
                content="Chunk body",
                contextual_content="Project sample-project uses AI retrieval.",
                score=0.9,
                metadata={
                    "title": "Sample Project",
                    "route": "/projects/sample-project",
                    "route_label": "Open Sample Project",
                    "source_type": "project",
                    "source_ref": "sample-project",
                    "section": "Sample Project",
                },
                dense_score=0.82,
                lexical_score=1.0,
                match_reasons=["dense", "lexical"],
            )
        ]
    )
    tool_service = StubToolService()
    llm_service = StubLlmService(
        QueryPlan(
            workflow="rag",
            intent="project_question",
            query_language="en",
            answer_language="en",
            needs_portfolio_context=True,
            tool_name=None,
            tool_arguments={},
            retrieval_queries=["sample AI project"],
            portfolio_areas=["projects"],
            suggested_actions=[
                {"type": "open_page", "target": "/projects", "label": "View projects"}
            ],
            prompt_tokens=10,
            completion_tokens=4,
        ),
        GeneratedText(
            text="The Sample Project uses AI retrieval in its workflow.",
            prompt_tokens=15,
            completion_tokens=7,
        ),
    )
    service.admin_client = admin_client
    service.embedding_service = StubEmbeddingService()
    service.repository = repository
    service.tool_service = tool_service
    service.llm_service = llm_service

    response = await ChatService.chat(
        service, ChatRequest(message="How does the sample AI project work?")
    )

    assert response.message == "The Sample Project uses AI retrieval in its workflow."
    confidence = response.metadata.retrieval_confidence
    assert admin_client.content_export_calls == 0
    assert admin_client.freelance_context_calls == 0
    assert response.metadata.query_language == "en"
    assert response.metadata.answer_language == "en"
    assert response.metadata.abstained is False
    assert confidence > 0.45
    assert response.citations[0].route == "/projects/sample-project"
    assert response.suggested_actions[0].target == "/projects/sample-project"


async def test_chat_service_abstains_in_indonesian_for_low_confidence_results() -> None:
    service = ChatService.__new__(ChatService)
    admin_client = StubAdminClient()
    repository = StubRepository(
        [
            RetrievedChunk(
                source="about:naufal",
                content="Short about chunk",
                contextual_content="General background snippet.",
                score=0.2,
                metadata={
                    "title": "About NaufalRF",
                    "route": "/about",
                    "route_label": "Open about page",
                    "source_type": "about",
                    "source_ref": "naufal",
                    "section": "About",
                },
                dense_score=0.2,
                lexical_score=0.0,
                match_reasons=["dense"],
            )
        ]
    )
    tool_service = StubToolService()
    llm_service = StubLlmService(
        QueryPlan(
            workflow="rag",
            intent="skills_question",
            query_language="id",
            answer_language="id",
            needs_portfolio_context=True,
            tool_name=None,
            tool_arguments={},
            retrieval_queries=["bagaimana skill AI saya"],
            portfolio_areas=["skills"],
            suggested_actions=[],
            prompt_tokens=8,
            completion_tokens=3,
        )
    )
    service.admin_client = admin_client
    service.embedding_service = StubEmbeddingService()
    service.repository = repository
    service.tool_service = tool_service
    service.llm_service = llm_service

    response = await ChatService.chat(service, ChatRequest(message="Bagaimana skill AI saya?"))

    assert "Saya belum punya informasi yang cukup kuat" in response.message
    confidence = response.metadata.retrieval_confidence
    assert admin_client.content_export_calls == 0
    assert admin_client.freelance_context_calls == 0
    assert response.metadata.query_language == "id"
    assert response.metadata.answer_language == "id"
    assert response.metadata.abstained is True
    assert confidence < 0.45
    assert llm_service.answer_calls == 0
    assert len(response.suggested_actions) == 1
    assert response.suggested_actions[0].target == "/about"
    assert response.suggested_actions[0].label == "Open about page"


async def test_chat_service_uses_generic_no_data_fallback_when_nothing_is_retrieved() -> None:
    service = ChatService.__new__(ChatService)
    admin_client = StubAdminClient()
    llm_service = StubLlmService(
        QueryPlan(
            workflow="rag",
            intent="personal_profile",
            query_language="en",
            answer_language="en",
            needs_portfolio_context=True,
            tool_name=None,
            tool_arguments={},
            retrieval_queries=["Naufal background"],
            portfolio_areas=["about", "skills"],
            suggested_actions=[],
            prompt_tokens=4,
            completion_tokens=2,
        )
    )
    service.admin_client = admin_client
    service.embedding_service = StubEmbeddingService()
    service.repository = StubRepository([])
    service.tool_service = StubToolService()
    service.llm_service = llm_service

    response = await ChatService.chat(service, ChatRequest(message="Tell me about Naufal"))

    assert "I don't have enough data" in response.message
    assert response.metadata.abstained is True
    assert response.suggested_actions[0].target == "/about"


async def test_chat_service_loads_tool_context_only_for_matching_intent() -> None:
    service = ChatService.__new__(ChatService)
    admin_client = StubAdminClient(
        ContentExport.model_validate(
            {
                "aboutMe": {
                    "bio": "",
                    "skills": [],
                    "experience": [],
                    "freelanceProfile": {
                        "hourlyRate": 150000,
                        "currency": "IDR",
                        "completedProjects": 12,
                        "featurePricing": [
                            {
                                "feature": "Drizzle authentication system",
                                "price": 1000000,
                            }
                        ],
                    },
                },
                "projects": [],
                "knowledgeDocs": [],
            }
        )
    )
    tool_service = StubToolService(
        ToolExecutionResult(
            tool_name="feature_pricing_quote",
            text="Quote ready",
            context="Tool context",
            metadata={"status": "completed"},
        )
    )
    llm_service = StubLlmService(
        QueryPlan(
            workflow="tool",
            intent="freelance_quote",
            query_language="en",
            answer_language="en",
            needs_portfolio_context=False,
            tool_name="feature_pricing_quote",
            tool_arguments={
                "modules": [
                    {
                        "name": "Authentication",
                        "features": ["Drizzle authentication system"],
                    }
                ]
            },
            retrieval_queries=[],
            portfolio_areas=[],
            suggested_actions=[],
            prompt_tokens=6,
            completion_tokens=2,
        )
    )
    service.admin_client = admin_client
    service.embedding_service = StubEmbeddingService()
    service.repository = StubRepository([])
    service.tool_service = tool_service
    service.llm_service = llm_service

    response = await ChatService.chat(service, ChatRequest(message="Quote this auth scope"))

    assert response.message == "Quote ready"
    assert admin_client.content_export_calls == 0
    assert admin_client.freelance_context_calls == 1
    execute_call = tool_service.execute_calls[0]
    arguments = execute_call["arguments"]
    assert isinstance(arguments, dict)
    freelance_profile = arguments["freelanceProfile"]
    assert isinstance(freelance_profile, dict)
    assert freelance_profile["hourlyRate"] == 150000.0
    assert execute_call["answer_language"] == "en"
    assert admin_client.save_mode == "append"
    saved_assistant_message = admin_client.saved_messages[-1]
    metadata = saved_assistant_message.get("metadata")
    assert isinstance(metadata, dict)
    assert metadata["model"]
    assert metadata["provider"] == "google"


async def test_chat_service_loads_freelance_context_for_hybrid_indonesian_intent() -> None:
    service = ChatService.__new__(ChatService)
    admin_client = StubAdminClient(
        ContentExport.model_validate(
            {
                "aboutMe": {
                    "bio": "",
                    "skills": [],
                    "experience": [],
                    "freelanceProfile": {
                        "hourlyRate": 175000,
                        "currency": "IDR",
                        "completedProjects": 18,
                        "pricingNotes": "Prefer fixed-price feature scopes.",
                        "featurePricing": [
                            {
                                "feature": "Authentication dashboard",
                                "price": 1500000,
                            }
                        ],
                    },
                },
                "projects": [],
                "knowledgeDocs": [],
            }
        )
    )
    repository = StubRepository([])
    tool_service = StubToolService()
    tool_service = StubToolService(
        ToolExecutionResult(
            tool_name="feature_pricing_quote",
            text="Rincian penawaran fitur freelance",
            context="Tool context",
            metadata={"status": "completed"},
        )
    )
    llm_service = StubLlmService(
        QueryPlan(
            workflow="hybrid",
            intent="freelance_quote",
            query_language="id",
            answer_language="id",
            needs_portfolio_context=True,
            tool_name=None,
            tool_arguments={},
            retrieval_queries=["estimasi harga dashboard auth"],
            portfolio_areas=["contact"],
            suggested_actions=[],
            prompt_tokens=7,
            completion_tokens=2,
        ),
        GeneratedText(
            text="Saya bisa menyiapkan estimasi berbasis referensi freelance yang ada.",
            prompt_tokens=11,
            completion_tokens=5,
        ),
    )
    service.admin_client = admin_client
    service.embedding_service = StubEmbeddingService()
    service.repository = repository
    service.tool_service = tool_service
    service.llm_service = llm_service

    response = await ChatService.chat(
        service, ChatRequest(message="Berapa estimasi harga dashboard auth?")
    )

    assert response.metadata.answer_language == "id"
    assert response.message == "Rincian penawaran fitur freelance"
    assert admin_client.content_export_calls == 0
    assert admin_client.freelance_context_calls == 1
    assert admin_client.save_mode == "append"
    assert llm_service.answer_calls == 0
    assert len(tool_service.execute_calls) == 1
    execute_call = tool_service.execute_calls[0]
    assert execute_call["tool_name"] == "feature_pricing_quote"
    assert execute_call["answer_language"] == "id"
    arguments = execute_call["arguments"]
    assert isinstance(arguments, dict)
    assert "freelanceProfile" in arguments
    assert response.metadata.model_dump(mode="json", by_alias=True) == {
        "workflow": "hybrid",
        "intent": "freelance_quote",
        "queryLanguage": "id",
        "answerLanguage": "id",
        "retrievalConfidence": 0.0,
        "abstained": False,
    }


async def test_chat_service_routes_freelance_service_questions_to_profile_lookup_tool() -> None:
    service = ChatService.__new__(ChatService)
    admin_client = StubAdminClient(
        ContentExport.model_validate(
            {
                "aboutMe": {
                    "bio": "",
                    "skills": [],
                    "experience": [],
                    "freelanceProfile": {
                        "hourlyRate": 200000,
                        "currency": "IDR",
                        "completedProjects": 11,
                    },
                },
                "projects": [],
                "knowledgeDocs": [],
            }
        )
    )
    tool_service = StubToolService(
        ToolExecutionResult(
            tool_name="freelance_profile_lookup",
            text="Freelance profile summary",
            context="Profile tool context",
            metadata={"status": "completed", "mode": "profile_lookup"},
        )
    )
    llm_service = StubLlmService(
        QueryPlan(
            workflow="tool",
            intent="freelance_services",
            query_language="en",
            answer_language="en",
            needs_portfolio_context=False,
            tool_name="freelance_profile_lookup",
            tool_arguments={},
            retrieval_queries=[],
            portfolio_areas=["contact"],
            suggested_actions=[],
            prompt_tokens=3,
            completion_tokens=1,
        )
    )
    service.admin_client = admin_client
    service.embedding_service = StubEmbeddingService()
    service.repository = StubRepository([])
    service.tool_service = tool_service
    service.llm_service = llm_service

    response = await ChatService.chat(
        service,
        ChatRequest(message="What freelance services do you offer?"),
    )

    assert response.message == "Freelance profile summary"
    assert admin_client.freelance_context_calls == 1
    assert tool_service.execute_calls[0]["tool_name"] == "freelance_profile_lookup"
