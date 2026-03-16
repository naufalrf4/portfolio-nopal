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
            "freelanceProfile": {
                "hourlyRate": 150000,
                "currency": "IDR",
                "completedProjects": 12,
                "featurePricing": [
                    {
                        "feature": "Drizzle authentication system",
                        "price": 1000000,
                        "relatedProjectSlugs": ["naufalrf-portfolio"],
                    }
                ],
                "projectReferences": [
                    {
                        "slug": "naufalrf-portfolio",
                        "title": "NaufalRF Portfolio Platform",
                    }
                ],
            },
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
    assert result.metadata["loadedFromIntentProfile"] is True
    assert result.metadata["hourlyRate"] == 150000.0
    line_items = cast(list[dict[str, object]], result.metadata["lineItems"])
    assert line_items[0]["price"] == 1000000.0
    related_projects = cast(list[dict[str, str]], line_items[0]["relatedProjects"])
    assert related_projects[0]["slug"] == "naufalrf-portfolio"
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


def test_feature_pricing_quote_returns_indonesian_output() -> None:
    service = ToolService()

    result = service.execute(
        "feature_pricing_quote",
        {
            "modules": [{"name": "Autentikasi", "features": ["Drizzle authentication system"]}],
            "freelanceProfile": {
                "currency": "IDR",
                "featurePricing": [
                    {
                        "feature": "Drizzle authentication system",
                        "price": 1000000,
                    }
                ],
            },
        },
        "Tolong hitungkan harga modul autentikasi ini",
        answer_language="id",
    )

    assert "Rincian penawaran fitur freelance" in result.text
    assert "Item referensi yang cocok" in result.text
