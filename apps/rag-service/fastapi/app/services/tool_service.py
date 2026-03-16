from dataclasses import dataclass
from typing import Any

DEFAULT_REFERENCE_PRICES: dict[str, float] = {
    "drizzle authentication system": 1_000_000.0,
}


@dataclass(slots=True)
class ToolExecutionResult:
    tool_name: str
    text: str
    context: str
    metadata: dict[str, object]


def _as_float(value: Any, default: float) -> float:
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        normalized = value.replace(",", "").strip()
        try:
            return float(normalized)
        except ValueError:
            return default
    return default


def _normalize_key(value: str) -> str:
    return " ".join(value.lower().replace("_", " ").replace("-", " ").split())


def _format_currency(amount: float, currency: str) -> str:
    rounded = int(round(amount))
    if currency.upper() == "IDR":
        return f"Rp{rounded:,.0f}".replace(",", ".")
    return f"{currency.upper()} {rounded:,.0f}"


def _as_string(value: Any) -> str:
    return value.strip() if isinstance(value, str) else ""


def _as_string_list(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []
    return [item.strip() for item in value if isinstance(item, str) and item.strip()]


def _as_reference_prices(value: Any) -> dict[str, float]:
    if not isinstance(value, dict):
        return {}

    prices: dict[str, float] = {}
    for key, raw_value in value.items():
        normalized_key = _normalize_key(str(key))
        if not normalized_key:
            continue
        price = _as_float(raw_value, -1)
        if price >= 0:
            prices[normalized_key] = price
    return prices


class ToolService:
    def execute(
        self, tool_name: str, arguments: dict[str, object], question: str
    ) -> ToolExecutionResult:
        if tool_name == "freelance_calculator":
            return self._execute_freelance_calculator(arguments, question)
        return ToolExecutionResult(
            tool_name=tool_name,
            text="I recognized a tool workflow, but the requested tool is not available yet.",
            context="No deterministic tool result was available.",
            metadata={"status": "unavailable"},
        )

    def _execute_freelance_calculator(
        self, arguments: dict[str, object], question: str
    ) -> ToolExecutionResult:
        currency = _as_string(arguments.get("currency")) or "IDR"
        project_name = _as_string(arguments.get("projectName"))
        requirements_summary = _as_string(arguments.get("requirementsSummary"))
        modules_input = arguments.get("modules")

        modules: list[dict[str, object]] = []
        if isinstance(modules_input, list):
            for module in modules_input:
                if not isinstance(module, dict):
                    continue
                module_name = _as_string(module.get("name"))
                features = _as_string_list(module.get("features"))
                if module_name or features:
                    modules.append({"name": module_name or "General", "features": features})

        if not modules:
            guidance = (
                "I can prepare a freelance quote breakdown, but I still need the "
                "module and feature list. Share the requirements as modules with "
                "feature items, then I can match them against your reference prices. "
                "Example reference already recognized: Drizzle authentication system = Rp1.000.000."
            )
            return ToolExecutionResult(
                tool_name="freelance_calculator",
                text=guidance,
                context=guidance,
                metadata={
                    "status": "needs_input",
                    "mode": "feature_breakdown",
                    "question": question,
                },
            )

        references = dict(DEFAULT_REFERENCE_PRICES)
        references.update(_as_reference_prices(arguments.get("referencePrices")))

        line_items: list[dict[str, object]] = []
        missing_features: list[str] = []
        matched_total = 0.0

        for module in modules:
            module_name = str(module.get("name") or "General")
            features = module.get("features")
            if not isinstance(features, list):
                continue

            for feature in features:
                if not isinstance(feature, str) or not feature.strip():
                    continue
                normalized_feature = _normalize_key(feature)
                price = references.get(normalized_feature)
                if price is None:
                    missing_features.append(feature.strip())
                    continue
                matched_total += price
                line_items.append(
                    {
                        "module": module_name,
                        "feature": feature.strip(),
                        "price": price,
                    }
                )

        text_lines = [
            f"Freelance feature quote breakdown ({currency.upper()}):",
        ]

        if project_name:
            text_lines.append(f"- Project: {project_name}")
        if requirements_summary:
            text_lines.append(f"- Requirement summary: {requirements_summary}")

        if line_items:
            text_lines.append("- Matched reference items:")
            for item in line_items:
                line_total = _format_currency(_as_float(item["price"], 0), currency)
                text_lines.append(f"  - {item['module']}: {item['feature']} = {line_total}")
            text_lines.append(
                f"- Current quoted subtotal: {_format_currency(matched_total, currency)}"
            )
        else:
            text_lines.append("- No module features matched the current reference catalog yet.")

        if missing_features:
            text_lines.append("- Missing reference prices for:")
            for feature in missing_features:
                text_lines.append(f"  - {feature}")
            text_lines.append(
                "- Add reference prices for the missing features, then rerun the "
                "breakdown to get a final quote."
            )

        text_lines.append(
            "- Pricing model: module/feature-based quoting using your freelance "
            "reference catalog, not hourly/day-rate estimation."
        )

        context = (
            f"Tool result from freelance_calculator. Module-feature pricing mode. "
            f"Matched subtotal: {_format_currency(matched_total, currency)}. "
            f"Matched items: {len(line_items)}. Missing references: {len(missing_features)}."
        )

        return ToolExecutionResult(
            tool_name="freelance_calculator",
            text="\n".join(text_lines),
            context=context,
            metadata={
                "status": "completed" if line_items and not missing_features else "needs_reference",
                "mode": "feature_breakdown",
                "currency": currency,
                "projectName": project_name,
                "requirementsSummary": requirements_summary,
                "modules": modules,
                "lineItems": line_items,
                "matchedSubtotal": matched_total,
                "missingFeatures": missing_features,
                "referenceCatalogSize": len(references),
            },
        )
