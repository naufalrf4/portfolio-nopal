from collections import defaultdict
from collections.abc import Iterable

from app.schemas.admin import ChatLogMessage


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


def build_chat_prompt(question: str, history: str, context: str) -> str:
    return (
        "You are NaufalRF portfolio guide running an Agentic Contextual RAG workflow. "
        "Answer only from the supplied context. Be concise, accurate, and clear. "
        "If the context is insufficient, say exactly what is missing and suggest "
        "the most relevant portfolio area to explore next.\n\n"
        f"Conversation history:\n{history}\n\n"
        f"Knowledge context:\n{context}\n\n"
        f"User question: {question}\n\n"
        "Return only the final answer text."
    )


def build_query_analysis_prompt(question: str, history: str) -> str:
    return (
        "You are planning retrieval for an Agentic Contextual RAG portfolio assistant. "
        "Analyze the request and return strict JSON only.\n\n"
        "Return this exact JSON object shape:\n"
        "{"
        '"workflow":"rag|tool|hybrid",'
        '"intent":"string",'
        '"needsPortfolioContext":true,'
        '"toolName":"freelance_calculator|",'
        '"toolArguments":{"projectName":"","requirementsSummary":"",'
        '"modules":[{"name":"Authentication","features":["drizzle authentication system"]}],'
        '"referencePrices":{"drizzle authentication system":1000000},"currency":"IDR"},'
        '"retrievalQueries":["string"],'
        '"portfolioAreas":["projects|about|blogs|experience|skills|contact|general"],'
        '"suggestedActions":[{"type":"open_page|highlight_section|open_link","target":"string","label":"string"}]'
        "}\n\n"
        "Rules:\n"
        "- Use workflow 'tool' for deterministic freelance pricing breakdowns that only "
        "need module/feature analysis\n"
        "- Use workflow 'hybrid' when pricing depends on both module breakdown and "
        "portfolio context or experience\n"
        "- Use workflow 'rag' for portfolio knowledge questions\n"
        "- toolName must be empty when workflow is 'rag'\n"
        "- toolArguments for freelance_calculator should describe module/feature "
        "breakdowns, reference prices, and currency instead of hourly/day-rate math\n"
        "- Only include referencePrices that are explicitly provided by the user or "
        "clearly established in prior context\n"
        "- retrievalQueries must contain 1 to 3 distinct concise search queries\n"
        "- suggestedActions must be empty when no website action is useful\n"
        "- target should be a route like /projects, /about, /blogs, /contact, "
        "/ai-chatbot or a section anchor like #featured-projects\n\n"
        f"Conversation history:\n{history}\n\n"
        f"Latest user question:\n{question}"
    )


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
        tool_name = "freelance_calculator"
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
        "Explain how this chunk fits into the whole source. Mention the main entity, "
        "topic, or section purpose. "
        "Do not repeat the chunk verbatim. Plain text only, maximum 2 short sentences.\n\n"
        f"Title: {title}\n"
        f"Source: {source}\n"
        f"Document summary:\n{summary}\n\n"
        f"Chunk text:\n{chunk_text}"
    )
