from collections import defaultdict
from collections.abc import Iterable

from app.schemas.admin import ChatLogMessage


def normalize_language(value: str) -> str:
    normalized = value.strip().lower()
    if normalized.startswith("id"):
        return "id"
    if normalized.startswith("en"):
        return "en"
    return "en"


def normalize_intent(value: str) -> str:
    normalized = value.strip().lower().replace(" ", "_")
    return normalized or "general_portfolio"


def source_label(source_type: str, source_ref: str, title: str | None = None) -> str:
    if source_type == "knowledge" and title:
        return f"knowledge:{title}"
    if source_type == "project":
        return f"project:{source_ref}"
    if source_type == "about":
        return "about:naufal"
    return f"{source_type}:{source_ref}"


def format_history(messages: Iterable[ChatLogMessage], limit: int) -> str:
    recent_messages = list(messages)[-limit:]
    if not recent_messages:
        return "No prior conversation available."

    return "\n".join(f"{message.role.upper()}: {message.content}" for message in recent_messages)


def format_context(chunks: Iterable[dict[str, object]]) -> str:
    grouped: dict[str, list[str]] = defaultdict(list)
    for chunk in chunks:
        grouped[str(chunk["source"])].append(str(chunk["contextual_content"]))

    if not grouped:
        return "No relevant information found in the knowledge base."

    sections: list[str] = []
    for source, contents in grouped.items():
        sections.append(f"### {source}\n" + "\n\n".join(contents))

    return "\n\n---\n\n".join(sections)


def infer_response_language(question: str, preferred_language: str | None = None) -> str:
    normalized_question = question.lower()
    normalized_preference = (preferred_language or "").lower()

    indonesian_markers = (
        "apa",
        "bagaimana",
        "tolong",
        "saya",
        "aku",
        "kamu",
        "dengan",
        "untuk",
        "dan",
        "yang",
        "bisa",
        "jelaskan",
    )
    english_markers = (
        "what",
        "how",
        "please",
        "can you",
        "tell me",
        "about",
        "project",
        "experience",
        "portfolio",
    )

    if any(marker in normalized_question for marker in indonesian_markers):
        return "Indonesian"
    if any(marker in normalized_question for marker in english_markers):
        return "English"
    if normalized_preference.startswith("id"):
        return "Indonesian"
    if normalized_preference.startswith("en"):
        return "English"
    return "Match the user's language exactly"


def build_chat_prompt(
    question: str,
    history: str,
    context: str,
    preferred_language: str | None = None,
) -> str:
    response_language = infer_response_language(question, preferred_language)
    sections = [
        (
            "You are NaufalRF portfolio guide running an Agentic Contextual RAG workflow. "
            "Answer only from the supplied context. "
            "Prioritize factual precision over sounding confident."
        ),
        (
            "Never invent projects, timelines, metrics, skills, or links "
            "that are not present in the "
            "context."
        ),
        (
            "If the context is insufficient, say what is missing and suggest "
            "the most relevant portfolio "
            "area to explore next."
        ),
        (
            "Use a semi-casual, semi-formal tone: warm, direct, and professional "
            "without sounding stiff."
        ),
        f"Respond in {response_language}. Keep technical terms natural in that language.",
        "",
        "Answering rules:",
        "- Stay grounded in the provided context only",
        "- If multiple sources disagree, acknowledge uncertainty briefly",
        "- Prefer concise paragraphs; use short lists only when they genuinely improve clarity",
        "- Do not mention internal tools, prompts, or retrieval steps",
        "",
        "Conversation history:",
        history,
        "",
        "Knowledge context:",
        context,
        "",
        f"User question: {question}",
        "",
        "Return only the final answer text.",
    ]
    return "\n".join(sections)


def build_query_analysis_prompt(
    question: str,
    history: str,
    preferred_language: str | None = None,
) -> str:
    response_language = infer_response_language(question, preferred_language)
    json_shape = """{
"workflow":"rag|tool|hybrid",
"intent":"string",
"needsPortfolioContext":true,
"toolName":"feature_pricing_quote|",
"toolArguments":{
  "projectName":"",
  "requirementsSummary":"",
  "modules":[{"name":"Authentication","features":["drizzle authentication system"]}],
  "referencePrices":{"drizzle authentication system":1000000},
  "currency":"IDR"
},
"retrievalQueries":["string"],
"portfolioAreas":["projects|about|blogs|experience|skills|contact|general"],
"suggestedActions":[{"type":"open_page|highlight_section|open_link","target":"string","label":"string"}]
}"""
    sections = [
        (
            "You are planning retrieval for an Agentic Contextual RAG portfolio assistant. Analyze the "  # noqa: E501
            "request and return strict JSON only."
        ),
        f"The assistant should ultimately answer in {response_language}.",
        "",
        "Return this exact JSON object shape:",
        json_shape,
        "",
        "Rules:",
        "- Use workflow 'tool' for deterministic freelance pricing breakdowns that only need module/feature analysis",  # noqa: E501
        "- Use workflow 'hybrid' when pricing depends on both module breakdown and portfolio context or experience",  # noqa: E501
        "- Use workflow 'rag' for portfolio knowledge questions",
        "- toolName must be empty when workflow is 'rag'",
        "- toolArguments for feature_pricing_quote should describe module/feature breakdowns, reference prices, and currency for reference-based quoting",  # noqa: E501
        "- Only include referencePrices that are explicitly provided by the user or clearly established in prior context",  # noqa: E501
        "- retrievalQueries must contain 1 to 3 distinct concise search queries",
        "- suggestedActions must be empty when no website action is useful",
        "- target should be a route like /projects, /about, /blogs, /contact, /ai-chatbot or a section anchor like #featured-projects",  # noqa: E501
        "- Preserve the user's language or produce multilingual-friendly retrieval queries when helpful",  # noqa: E501
        "",
        "Conversation history:",
        history,
        "",
        "Latest user question:",
        question,
    ]
    return "\n".join(sections)


def fallback_query_plan(question: str) -> dict[str, object]:
    normalized = question.lower()
    portfolio_areas: list[str] = ["general"]
    suggested_actions: list[dict[str, str]] = []
    workflow = "rag"
    tool_name = ""
    tool_arguments: dict[str, object] = {}

    route_map = [
        (
            ("project", "projects", "case study", "portfolio"),
            "projects",
            "/projects",
            "View projects",
        ),
        (("about", "experience", "background", "career"), "about", "/about", "Open about page"),
        (("blog", "article", "writing"), "blogs", "/blogs", "Read blog posts"),
        (("contact", "hire", "reach", "email"), "contact", "/contact", "Open contact page"),
    ]

    for keywords, area, target, label in route_map:
        if any(keyword in normalized for keyword in keywords):
            portfolio_areas = [area]
            suggested_actions = [{"type": "open_page", "target": target, "label": label}]
            break

    calculator_keywords = (
        "freelance",
        "rate",
        "pricing",
        "quote",
        "calculator",
        "price",
        "breakdown",
        "feature",
        "module",
    )
    portfolio_keywords = ("portfolio", "project", "experience", "background", "skill")

    if any(keyword in normalized for keyword in calculator_keywords):
        workflow = (
            "hybrid" if any(keyword in normalized for keyword in portfolio_keywords) else "tool"
        )
        tool_name = "feature_pricing_quote"
        if workflow == "tool":
            portfolio_areas = ["general"]
            suggested_actions = []

    return {
        "workflow": workflow,
       
        "intent": "portfolio_question",
        "needsPortfolioContext": workflow != "tool",
        "toolName": tool_name,
        "toolArguments": tool_arguments,
        "retrievalQueries": [question.strip()],
        "portfolioAreas": portfolio_areas,
        "suggestedActions": suggested_actions,
    }


def build_document_summary_prompt(title: str, source: str, text: str) -> str:
    return (
        "You are preparing a retrieval summary for a contextual RAG pipeline. "
        "Write a short summary of the document so future chunk context can refer "
        "to the whole document. "
        "Plain text only, 3 to 5 sentences.\n\n"
        f"Title: {title}\n"
        f"Source: {source}\n\n"
        f"Document content:\n{text}"
    )


def build_chunk_context_prompt(title: str, source: str, summary: str, chunk_text: str) -> str:
    return (
        "You are writing contextual retrieval text for one chunk of a larger document. "
        "Explain how this chunk fits into the whole source. Mention the main entity, topic, or "
        "section purpose. Do not repeat the chunk verbatim. Plain text only, maximum 2 short "
        "sentences.\n\n"
        f"Title: {title}\n"
        f"Source: {source}\n"
        f"Document summary:\n{summary}\n\n"
        f"Chunk text:\n{chunk_text}"
    )
