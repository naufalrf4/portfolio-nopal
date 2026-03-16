import json
import re
from collections import defaultdict
from collections.abc import Iterable

from app.schemas.admin import ChatLogMessage

INTENT_ALIASES = {
    "freelance_quote": {
        "freelance_quote",
        "freelance_pricing",
        "pricing_quote",
        "quote_request",
        "project_quote",
        "hire_quote",
    },
    "project_question": {"project_question", "projects_question", "case_study_question"},
    "experience_question": {"experience_question", "background_question", "career_question"},
    "skills_question": {"skills_question", "skill_question", "tech_stack_question"},
    "blog_question": {"blog_question", "article_question", "writing_question"},
    "contact_question": {"contact_question", "hire_question", "booking_question"},
    "greeting": {"greeting", "small_talk"},
    "out_of_scope": {"out_of_scope", "none", "abstain", "unknown"},
    "general_portfolio": {"general_portfolio", "portfolio_question", "general_question"},
}


def source_label(source_type: str, source_ref: str, title: str | None = None) -> str:
    if source_type == "knowledge" and title:
        return f"knowledge:{title}"
    if source_type == "project":
        return f"project:{source_ref}"
    if source_type == "about":
        return "about:naufal"
    return f"{source_type}:{source_ref}"


def source_route(source_type: str, source_ref: str) -> str:
    if source_type == "project":
        return f"/projects/{source_ref}"
    if source_type == "about":
        return "/about"
    if source_type == "knowledge":
        return "/ai-chatbot"
    return "/ai-chatbot"


def source_route_label(source_type: str, title: str | None = None) -> str:
    if source_type == "project":
        return f"Open {title}" if title else "Open project"
    if source_type == "about":
        return "Open about page"
    if source_type == "knowledge":
        return "Continue in AI assistant"
    return "Open AI assistant"


def source_section(source_type: str, title: str | None = None) -> str:
    if source_type == "project":
        return title or "Project"
    if source_type == "about":
        return "About"
    if source_type == "knowledge":
        return title or "Knowledge"
    return title or "General"


def build_source_metadata(
    source_type: str, source_ref: str, title: str | None = None
) -> dict[str, str]:
    return {
        "source_label": source_label(source_type, source_ref, title),
        "source_type": source_type,
        "source_ref": source_ref,
        "route": source_route(source_type, source_ref),
        "route_label": source_route_label(source_type, title),
        "section": source_section(source_type, title),
        "title": title or source_ref,
    }


def build_grounded_actions(
    suggested_actions: Iterable[dict[str, str]], citations: Iterable[dict[str, object]]
) -> list[dict[str, str]]:
    citation_list = list(citations)
    routes = [str(citation.get("route")) for citation in citation_list if citation.get("route")]
    route_labels = {
        str(citation.get("route")): str(
            citation.get("routeLabel") or citation.get("title") or "Open source"
        )
        for citation in citation_list
        if citation.get("route")
    }

    grounded: list[dict[str, str]] = []
    seen: set[tuple[str, str, str]] = set()
    for action in suggested_actions:
        action_type = str(action.get("type", "")).strip()
        target = str(action.get("target", "")).strip()
        label = str(action.get("label", "")).strip()
        if not action_type or not target or not label:
            continue
        if action_type == "open_page":
            if not _matches_grounded_route(target, routes):
                continue
            canonical_target = _pick_grounded_route(target, routes)
            normalized = (action_type, canonical_target, label)
            if normalized in seen:
                continue
            seen.add(normalized)
            grounded.append({"type": action_type, "target": canonical_target, "label": label})
            continue
        if action_type == "highlight_section" and target.startswith("#"):
            normalized = (action_type, target, label)
            if normalized in seen:
                continue
            seen.add(normalized)
            grounded.append({"type": action_type, "target": target, "label": label})

    if grounded:
        return grounded

    for route in routes:
        label = route_labels.get(route, "Open source")
        normalized = ("open_page", route, label)
        if normalized in seen:
            continue
        seen.add(normalized)
        grounded.append({"type": "open_page", "target": route, "label": label})
        break

    return grounded


def _matches_grounded_route(target: str, routes: Iterable[str]) -> bool:
    for route in routes:
        if route == target:
            return True
        normalized_target = target.rstrip("/")
        if normalized_target and route.startswith(f"{normalized_target}/"):
            return True
    return False


def _pick_grounded_route(target: str, routes: Iterable[str]) -> str:
    for route in routes:
        if route == target:
            return route
    normalized_target = target.rstrip("/")
    for route in routes:
        if normalized_target and route.startswith(f"{normalized_target}/"):
            return route
    return target


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


def build_chat_prompt(
    question: str, history: str, context: str, answer_language: str = "en"
) -> str:
    language_name = "Indonesian" if normalize_language(answer_language) == "id" else "English"
    return (
        "You are NaufalRF portfolio guide running an Agentic Contextual RAG workflow. "
        "Answer only from the supplied context. Be concise, accurate, and clear. "
        "If the context is insufficient, say exactly what is missing and suggest "
        "the most relevant portfolio area to explore next. "
        f"Respond in {language_name}.\n\n"
        f"Conversation history:\n{history}\n\n"
        f"Knowledge context:\n{context}\n\n"
        f"User question: {question}\n\n"
        "Return only the final answer text."
    )


def build_query_analysis_prompt(question: str, history: str) -> str:
    return (
        "You are planning retrieval for an Agentic Contextual RAG portfolio assistant. "
        "Analyze the request and return strict JSON only. Normalize informal Indonesian, "
        "Indoglish, and English paraphrases into the same intent taxonomy before routing.\n\n"
        "Return this exact JSON object shape:\n"
        "{"
        '"workflow":"rag|tool|hybrid",'
        '"intent":"general_portfolio|freelance_quote|project_question|experience_question|skills_question|blog_question|contact_question|greeting|out_of_scope",'
        '"queryLanguage":"id|en",'
        '"answerLanguage":"id|en",'
        '"needsPortfolioContext":true,'
        '"toolName":"feature_pricing_quote|",'
        '"toolArguments":{"projectName":"","requirementsSummary":"",'
        '"modules":[{"name":"Authentication","features":["drizzle authentication system"]}],'
        '"referencePrices":{"drizzle authentication system":1000000},"currency":"IDR"},'
        '"retrievalQueries":["string"],'
        '"portfolioAreas":["projects|about|blogs|experience|skills|contact|general"],'
        '"suggestedActions":[{"type":"open_page|highlight_section|open_link","target":"string","label":"string"}]'
        "}\n\n"
        "Rules:\n"
        "- Normalize intent labels to the allowed taxonomy exactly\n"
        "- Treat Indonesian, English, and mixed-language versions of the same request "
        "as the same intent\n"
        "- Normalize informal Indonesian phrasing into the same intent as formal Indonesian\n"
        "- Use workflow 'tool' for deterministic freelance pricing breakdowns that only "
        "need module/feature analysis\n"
        "- Use workflow 'hybrid' when pricing depends on both module breakdown and "
        "portfolio context or experience\n"
        "- Use workflow 'rag' for portfolio knowledge questions\n"
        "- queryLanguage and answerLanguage must match the user's latest "
        "message language: 'id' for Indonesian, 'en' for English\n"
        "- toolName must be empty when workflow is 'rag'\n"
        "- toolArguments for feature_pricing_quote should describe module/feature "
        "breakdowns, reference prices, and currency for reference-based quoting\n"
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
    language = detect_language(question)
    intent = classify_intent(question)
    embedded_tool_arguments = extract_embedded_tool_arguments(question)
    portfolio_areas: list[str] = ["general"]
    suggested_actions: list[dict[str, str]] = []
    workflow = "rag"
    tool_name = ""
    tool_arguments: dict[str, object] = {}

    route_map = [
        (
            ("project", "projects", "case study", "portfolio", "proyek", "portofolio"),
            "projects",
            "/projects",
            "Lihat proyek" if language == "id" else "View projects",
        ),
        (
            ("about", "experience", "background", "career", "tentang", "pengalaman", "karier"),
            "about",
            "/about",
            "Buka halaman tentang" if language == "id" else "Open about page",
        ),
        (
            ("blog", "article", "writing", "artikel", "tulisan"),
            "blogs",
            "/blogs",
            "Baca blog" if language == "id" else "Read blog posts",
        ),
        (
            ("contact", "hire", "reach", "email", "kontak", "hubungi", "booking", "book"),
            "contact",
            "/contact",
            "Buka halaman kontak" if language == "id" else "Open contact page",
        ),
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
        "quoted",
        "calculator",
        "price",
        "harga",
        "biaya",
        "estimasi",
        "penawaran",
        "quotation",
        "breakdown",
        "feature",
        "fitur",
        "module",
        "modul",
    )
    portfolio_keywords = (
        "portfolio",
        "project",
        "experience",
        "background",
        "skill",
        "proyek",
        "pengalaman",
        "keahlian",
    )

    if any(keyword in normalized for keyword in calculator_keywords):
        workflow = (
            "hybrid" if any(keyword in normalized for keyword in portfolio_keywords) else "tool"
        )
        tool_name = "feature_pricing_quote"
        intent = "freelance_quote"
        if embedded_tool_arguments:
            tool_arguments = embedded_tool_arguments
            workflow = "tool"
            portfolio_areas = ["general"]
            suggested_actions = []
        if workflow == "tool":
            portfolio_areas = ["general"]
            suggested_actions = []

    if intent in {"greeting", "out_of_scope"}:
        portfolio_areas = ["general"]
        suggested_actions = []

    return {
        "workflow": workflow,
        "intent": intent,
        "queryLanguage": language,
        "answerLanguage": language,
        "needsPortfolioContext": workflow != "tool",
        "toolName": tool_name,
        "toolArguments": tool_arguments,
        "retrievalQueries": [question.strip()],
        "portfolioAreas": portfolio_areas,
        "suggestedActions": suggested_actions,
    }


def extract_embedded_tool_arguments(question: str) -> dict[str, object]:
    marker_match = re.search(r"toolArguments\s*:\s*", question, flags=re.IGNORECASE)
    if marker_match is None:
        return {}

    remainder = question[marker_match.end() :].lstrip()
    if not remainder.startswith("{"):
        return {}

    depth = 0
    in_string = False
    escape = False
    for index, char in enumerate(remainder):
        if in_string:
            if escape:
                escape = False
                continue
            if char == "\\":
                escape = True
                continue
            if char == '"':
                in_string = False
            continue

        if char == '"':
            in_string = True
            continue
        if char == "{":
            depth += 1
            continue
        if char == "}":
            depth -= 1
            if depth == 0:
                candidate = remainder[: index + 1]
                try:
                    parsed = json.loads(candidate)
                except (TypeError, ValueError, json.JSONDecodeError):
                    return {}
                return parsed if isinstance(parsed, dict) else {}

    return {}


def detect_language(text: str) -> str:
    normalized = f" {text.strip().lower()} "
    indonesian_markers = (
        " yang ",
        " dengan ",
        " untuk ",
        " saya ",
        " aku ",
        " gue ",
        " gw ",
        " kamu ",
        " apa ",
        " berapa ",
        " bagaimana ",
        " gimana ",
        " proyek ",
        " proyeknya ",
        " portofolio ",
        " tentang ",
        " bisa ",
        " tolong ",
        " tidak ",
        " nggak ",
        " gak ",
        " dan ",
        " biaya ",
        " harga ",
        " fitur ",
        " modul ",
        " kerja ",
    )
    if any(marker in normalized for marker in indonesian_markers):
        return "id"
    return "en"


def normalize_intent(value: str | None) -> str:
    normalized = _normalize_text(value)
    for canonical, aliases in INTENT_ALIASES.items():
        normalized_aliases = {_normalize_text(alias) for alias in aliases}
        if normalized in normalized_aliases:
            return canonical
    return "general_portfolio"


def is_freelance_intent(intent: str | None) -> bool:
    return normalize_intent(intent) == "freelance_quote"


def classify_intent(question: str) -> str:
    normalized = _normalize_text(question)

    if any(
        keyword in normalized
        for keyword in (
            "hello",
            "hi",
            "hey",
            "halo",
            "hai",
            "selamat pagi",
            "selamat siang",
            "selamat malam",
        )
    ):
        return "greeting"

    if any(
        keyword in normalized
        for keyword in (
            "price",
            "pricing",
            "quote",
            "rate",
            "budget",
            "cost",
            "harga",
            "biaya",
            "estimasi",
            "penawaran",
            "freelance",
            "fitur",
            "modul",
        )
    ):
        return "freelance_quote"

    if any(
        keyword in normalized
        for keyword in (
            "project",
            "projects",
            "case study",
            "portfolio",
            "proyek",
            "portofolio",
        )
    ):
        return "project_question"

    if any(
        keyword in normalized
        for keyword in (
            "experience",
            "background",
            "career",
            "pengalaman",
            "karier",
            "latar belakang",
        )
    ):
        return "experience_question"

    if any(
        keyword in normalized
        for keyword in (
            "skill",
            "skills",
            "tech stack",
            "keahlian",
            "kemampuan",
            "teknologi",
        )
    ):
        return "skills_question"

    if any(
        keyword in normalized
        for keyword in (
            "blog",
            "blogs",
            "article",
            "articles",
            "writing",
            "artikel",
            "tulisan",
        )
    ):
        return "blog_question"

    if any(
        keyword in normalized
        for keyword in (
            "contact",
            "hire",
            "reach",
            "email",
            "book",
            "booking",
            "kontak",
            "hubungi",
            "kerja sama",
        )
    ):
        return "contact_question"

    return "general_portfolio"


def _normalize_text(value: str | None) -> str:
    return " ".join((value or "").strip().lower().replace("_", " ").replace("-", " ").split())


def normalize_language(value: str | None) -> str:
    normalized = (value or "").strip().lower()
    if normalized in {"id", "indonesian", "bahasa indonesia", "bahasa"}:
        return "id"
    return "en"


def build_abstention_response(answer_language: str, portfolio_areas: Iterable[str]) -> str:
    normalized_language = normalize_language(answer_language)
    areas = [area for area in portfolio_areas if area and area != "general"]
    if normalized_language == "id":
        if areas:
            return (
                "Saya belum menemukan bukti portofolio yang cukup kuat untuk "
                "menjawab pertanyaan itu dengan yakin. "
                f"Coba arahkan saya ke area yang lebih spesifik seperti {', '.join(areas)}."
            )
        return (
            "Saya belum menemukan bukti portofolio yang cukup kuat untuk "
            "menjawab pertanyaan itu dengan yakin. "
            "Coba tanyakan proyek, pengalaman, skill, blog, atau konteks yang lebih spesifik."
        )
    if areas:
        return (
            "I do not have enough grounded portfolio evidence to answer that confidently. "
            f"Please point me to a more specific area such as {', '.join(areas)}."
        )
    return (
        "I do not have enough grounded portfolio evidence to answer that confidently. "
        "Please ask about a more specific project, experience, skill, blog, or page."
    )


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
