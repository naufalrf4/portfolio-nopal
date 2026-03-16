from typing import cast

from app.services.tool_service import ToolService


def test_feature_pricing_quote_returns_guidance_without_modules() -> None:
    service = ToolService()

    result = service.execute("feature_pricing_quote", {}, "help me price freelance work")

    assert result.metadata["status"] == "needs_input"
    assert result.metadata["mode"] == "feature_breakdown"
    assert "module and feature list" in result.text.lower()


def test_feature_pricing_quote_computes_feature_quote_breakdown() -> None:
    service = ToolService()

    result = service.execute(
        "feature_pricing_quote",
        {
            "projectName": "Auth revamp",
            "requirementsSummary": "Need login and session setup",
            "modules": [
                {
                    "name": "Authentication",
                    "features": ["Drizzle authentication system"],
                }
            ],
        },
        "break down the freelance quote for this authentication module",
    )

    assert result.metadata["status"] == "completed"
    assert result.metadata["matchedSubtotal"] == 1000000.0
    assert result.metadata["missingFeatures"] == []
    line_items = cast(list[dict[str, object]], result.metadata["lineItems"])
    assert line_items[0]["price"] == 1000000.0
    assert "drizzle authentication system" in result.text.lower()


def test_feature_pricing_quote_flags_missing_reference_prices() -> None:
    service = ToolService()

    result = service.execute(
        "feature_pricing_quote",
        {
            "modules": [
                {
                    "name": "Authentication",
                    "features": ["Custom RBAC dashboard"],
                }
            ],
        },
        "quote this custom RBAC dashboard feature",
    )

    assert result.metadata["status"] == "needs_reference"
    assert result.metadata["matchedSubtotal"] == 0.0
    assert result.metadata["missingFeatures"] == ["Custom RBAC dashboard"]
    assert "missing reference prices" in result.text.lower()
