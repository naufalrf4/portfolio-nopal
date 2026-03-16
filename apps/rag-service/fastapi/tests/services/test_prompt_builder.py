from app.services.prompt_builder import (
    build_abstention_response,
    build_grounded_actions,
    build_source_metadata,
    fallback_query_plan,
    normalize_intent,
)


def test_build_source_metadata_for_project_sets_route_fields() -> None:
    metadata = build_source_metadata("project", "sample-project", "Sample Project")

    assert metadata["source_label"] == "project:sample-project"
    assert metadata["route"] == "/projects/sample-project"
    assert metadata["route_label"] == "Open Sample Project"
    assert metadata["section"] == "Sample Project"


def test_build_grounded_actions_prefers_retrieved_project_route() -> None:
    actions = build_grounded_actions(
        [{"type": "open_page", "target": "/projects", "label": "View projects"}],
        [
            {
                "source": "project:sample-project",
                "title": "Sample Project",
                "route": "/projects/sample-project",
                "routeLabel": "Open Sample Project",
                "sourceType": "project",
                "sourceRef": "sample-project",
                "section": "Sample Project",
            }
        ],
    )

    assert actions == [
        {
            "type": "open_page",
            "target": "/projects/sample-project",
            "label": "View projects",
        }
    ]


def test_build_grounded_actions_falls_back_to_citation_route_when_planner_is_empty() -> None:
    actions = build_grounded_actions(
        [],
        [
            {
                "source": "about:naufal",
                "title": "About NaufalRF",
                "route": "/about",
                "routeLabel": "Open about page",
                "sourceType": "about",
                "sourceRef": "naufal",
                "section": "About",
            }
        ],
    )

    assert actions == [{"type": "open_page", "target": "/about", "label": "Open about page"}]


def test_fallback_query_plan_detects_indonesian_language() -> None:
    plan = fallback_query_plan("Bagaimana proyek AI saya bekerja?")

    assert plan["queryLanguage"] == "id"
    assert plan["answerLanguage"] == "id"
    assert plan["intent"] == "project_question"


def test_fallback_query_plan_maps_indonesian_quote_request_to_freelance_intent() -> None:
    plan = fallback_query_plan("Tolong buat estimasi harga modul auth dan dashboard admin")

    assert plan["queryLanguage"] == "id"
    assert plan["answerLanguage"] == "id"
    assert plan["intent"] == "freelance_quote"
    assert plan["toolName"] == "feature_pricing_quote"
    assert plan["workflow"] == "tool"


def test_fallback_query_plan_extracts_embedded_tool_arguments() -> None:
    plan = fallback_query_plan(
        'Buat penawaran. toolArguments: {"projectName":"Internal Ops Portal","currency":"IDR",'
        '"modules":[{"name":"Authentication","features":["Authentication dashboard"]},'
        '{"name":"Operations","features":["Admin dashboard"]}]}'
    )

    assert plan["intent"] == "freelance_quote"
    assert plan["toolName"] == "feature_pricing_quote"
    assert plan["workflow"] == "tool"
    tool_arguments = plan["toolArguments"]
    assert isinstance(tool_arguments, dict)
    assert tool_arguments["projectName"] == "Internal Ops Portal"
    assert tool_arguments["currency"] == "IDR"
    modules = tool_arguments["modules"]
    assert isinstance(modules, list)
    assert len(modules) == 2


def test_normalize_intent_collapses_aliases() -> None:
    assert normalize_intent("pricing_quote") == "freelance_quote"
    assert normalize_intent("portfolio_question") == "general_portfolio"


def test_build_abstention_response_uses_requested_language() -> None:
    response = build_abstention_response("id", ["projects", "skills"])

    assert "Saya belum menemukan bukti portofolio" in response
    assert "projects, skills" in response
