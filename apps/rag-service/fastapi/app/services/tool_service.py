from dataclasses import dataclass
from typing import cast

from app.services.prompt_builder import normalize_language


@dataclass(slots=True)
class ToolExecutionResult:
    tool_name: str
    text: str
    context: str
    metadata: dict[str, object]


def _as_float(value: object, default: float) -> float:
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


def _as_string(value: object) -> str:
    return value.strip() if isinstance(value, str) else ""


def _as_string_list(value: object) -> list[str]:
    if not isinstance(value, list):
        return []

    items = cast(list[object], value)
    return [item.strip() for item in items if isinstance(item, str) and item.strip()]


def _as_reference_prices(value: object) -> dict[str, float]:
    if not isinstance(value, dict):
        return {}

    typed_value = cast(dict[object, object], value)
    prices: dict[str, float] = {}
    for key, raw_value in typed_value.items():
        normalized_key = _normalize_key(str(key))
        if not normalized_key:
            continue
        price = _as_float(raw_value, -1)
        if price >= 0:
            prices[normalized_key] = price
    return prices


def _as_freelance_profile(value: object) -> dict[str, object]:
    if not isinstance(value, dict):
        return {}

    typed_value = cast(dict[str, object], value)

    feature_pricing: list[dict[str, object]] = []
    for item in cast(list[object], typed_value.get("featurePricing", [])):
        if not isinstance(item, dict):
            continue
        typed_item = cast(dict[str, object], item)
        feature = _as_string(typed_item.get("feature"))
        if not feature:
            continue
        feature_pricing.append(
            {
                "feature": feature,
                "price": _as_float(typed_item.get("price"), -1),
                "notes": _as_string(typed_item.get("notes")),
                "relatedProjectSlugs": _as_string_list(typed_item.get("relatedProjectSlugs")),
            }
        )

    project_references: list[dict[str, str]] = []
    for item in cast(list[object], typed_value.get("projectReferences", [])):
        if not isinstance(item, dict):
            continue
        typed_item = cast(dict[str, object], item)
        slug = _as_string(typed_item.get("slug"))
        title = _as_string(typed_item.get("title"))
        if not slug or not title:
            continue
        project_references.append(
            {
                "slug": slug,
                "title": title,
                "notes": _as_string(typed_item.get("notes")),
            }
        )

    return {
        "hourlyRate": _as_float(typed_value.get("hourlyRate"), -1),
        "currency": _as_string(typed_value.get("currency")) or "IDR",
        "completedProjects": int(_as_float(typed_value.get("completedProjects"), -1)),
        "pricingNotes": _as_string(typed_value.get("pricingNotes")),
        "featurePricing": feature_pricing,
        "projectReferences": project_references,
    }


def _reference_catalog_from_profile(profile: dict[str, object]) -> dict[str, dict[str, object]]:
    catalog: dict[str, dict[str, object]] = {}
    for item in cast(list[object], profile.get("featurePricing", [])):
        if not isinstance(item, dict):
            continue
        typed_item = cast(dict[str, object], item)
        feature = _normalize_key(str(typed_item.get("feature", "")))
        price = _as_float(typed_item.get("price"), -1)
        if not feature or price < 0:
            continue
        catalog[feature] = {
            "price": price,
            "notes": _as_string(typed_item.get("notes")),
            "relatedProjectSlugs": _as_string_list(typed_item.get("relatedProjectSlugs")),
        }
    return catalog


def _project_reference_lookup(profile: dict[str, object]) -> dict[str, dict[str, str]]:
    lookup: dict[str, dict[str, str]] = {}
    for item in cast(list[object], profile.get("projectReferences", [])):
        if not isinstance(item, dict):
            continue
        typed_item = cast(dict[str, object], item)
        slug = _as_string(typed_item.get("slug"))
        title = _as_string(typed_item.get("title"))
        if not slug or not title:
            continue
        lookup[slug] = {
            "slug": slug,
            "title": title,
            "notes": _as_string(typed_item.get("notes")),
        }
    return lookup


class ToolService:
    def execute(
        self,
        tool_name: str,
        arguments: dict[str, object],
        question: str,
        answer_language: str = "en",
    ) -> ToolExecutionResult:
        if tool_name == "feature_pricing_quote":
            return self._execute_feature_pricing_quote(arguments, question, answer_language)
        if tool_name == "freelance_profile_lookup":
            return self._execute_freelance_profile_lookup(arguments, answer_language)
        return ToolExecutionResult(
            tool_name=tool_name,
            text=(
                "Saya mengenali workflow tool, tetapi tool yang diminta belum tersedia."
                if normalize_language(answer_language) == "id"
                else "I recognized a tool workflow, but the requested tool is not available yet."
            ),
            context=(
                "Belum ada hasil tool deterministik yang tersedia."
                if normalize_language(answer_language) == "id"
                else "No deterministic tool result was available."
            ),
            metadata={"status": "unavailable"},
        )

    def _execute_freelance_profile_lookup(
        self, arguments: dict[str, object], answer_language: str
    ) -> ToolExecutionResult:
        is_indonesian = normalize_language(answer_language) == "id"
        profile = _as_freelance_profile(arguments.get("freelanceProfile"))
        feature_pricing = cast(list[dict[str, object]], profile.get("featurePricing", []))
        project_references = cast(list[dict[str, str]], profile.get("projectReferences", []))

        if not profile:
            text = (
                " ".join(
                    [
                        "Saya belum punya profil freelance terstruktur yang cukup",
                        "untuk menjawab itu secara deterministik.",
                    ]
                )
                if is_indonesian
                else " ".join(
                    [
                        "I don't have enough structured freelance profile data",
                        "to answer that deterministically yet.",
                    ]
                )
            )
            return ToolExecutionResult(
                tool_name="freelance_profile_lookup",
                text=text,
                context=text,
                metadata={"status": "unavailable", "mode": "profile_lookup"},
            )

        currency = _as_string(profile.get("currency")) or "IDR"
        text_lines = [
            "Ringkasan profil freelance:" if is_indonesian else "Freelance profile summary:",
        ]

        hourly_rate = _as_float(profile.get("hourlyRate"), -1)
        if hourly_rate >= 0:
            label = "Rate per jam" if is_indonesian else "Hourly rate"
            text_lines.append(f"- {label}: {_format_currency(hourly_rate, currency)}")

        completed_projects = int(_as_float(profile.get("completedProjects"), -1))
        if completed_projects >= 0:
            label = "Proyek selesai" if is_indonesian else "Completed projects"
            text_lines.append(f"- {label}: {completed_projects}")

        pricing_notes = _as_string(profile.get("pricingNotes"))
        if pricing_notes:
            label = "Catatan pricing" if is_indonesian else "Pricing notes"
            text_lines.append(f"- {label}: {pricing_notes}")

        if feature_pricing:
            label = (
                "Contoh fitur berharga referensi"
                if is_indonesian
                else "Example referenced features"
            )
            text_lines.append(f"- {label}:")
            for item in feature_pricing[:5]:
                feature = _as_string(item.get("feature"))
                price = _as_float(item.get("price"), -1)
                if not feature or price < 0:
                    continue
                text_lines.append(f"  - {feature}: {_format_currency(price, currency)}")

        if project_references:
            label = "Referensi proyek" if is_indonesian else "Project references"
            titles = [
                project["title"] for project in project_references[:4] if project.get("title")
            ]
            if titles:
                text_lines.append(f"- {label}: {', '.join(titles)}")

        context = (
            "Tool result from freelance_profile_lookup. "
            f"Hourly rate available: {hourly_rate >= 0}. "
            f"Completed projects: {completed_projects if completed_projects >= 0 else 'unknown'}. "
            f"Feature pricing entries: {len(feature_pricing)}. "
            f"Project references: {len(project_references)}."
        )

        return ToolExecutionResult(
            tool_name="freelance_profile_lookup",
            text="\n".join(text_lines),
            context=context,
            metadata={
                "status": "completed",
                "mode": "profile_lookup",
                "currency": currency,
                "hourlyRate": None if hourly_rate < 0 else hourly_rate,
                "completedProjects": None if completed_projects < 0 else completed_projects,
                "featurePricingCount": len(feature_pricing),
                "projectReferenceCount": len(project_references),
            },
        )

    def _execute_feature_pricing_quote(
        self, arguments: dict[str, object], question: str, answer_language: str
    ) -> ToolExecutionResult:
        is_indonesian = normalize_language(answer_language) == "id"
        profile = _as_freelance_profile(arguments.get("freelanceProfile"))
        profile_catalog = _reference_catalog_from_profile(profile)
        project_lookup = _project_reference_lookup(profile)
        currency = _as_string(arguments.get("currency")) or str(profile.get("currency") or "IDR")
        project_name = _as_string(arguments.get("projectName"))
        requirements_summary = _as_string(arguments.get("requirementsSummary"))
        modules_input = arguments.get("modules")

        modules: list[dict[str, str | list[str]]] = []
        if isinstance(modules_input, list):
            for module in cast(list[object], modules_input):
                if not isinstance(module, dict):
                    continue
                typed_module = cast(dict[str, object], module)
                module_name = _as_string(typed_module.get("name"))
                features = _as_string_list(typed_module.get("features"))
                if module_name or features:
                    modules.append({"name": module_name or "General", "features": features})

        if not modules:
            example_features = list(profile_catalog.keys())[:2]
            example_line = (
                (
                    f" Contoh referensi yang sudah dikenali: {', '.join(example_features)}."
                    if is_indonesian
                    else f" Reference examples already recognized: {', '.join(example_features)}."
                )
                if example_features
                else ""
            )
            guidance = (
                " ".join(
                    [
                        "Saya bisa menyiapkan rincian penawaran freelance, tetapi saya masih butuh",
                        "daftar modul dan fitur. Kirim requirement sebagai modul dengan",
                        "item fitur, lalu saya akan cocokkan dengan harga referensi Anda.",
                    ]
                )
                if is_indonesian
                else " ".join(
                    [
                        "I can prepare a freelance quote breakdown, but I still need the",
                        "module and feature list. Share the requirements as modules with",
                        "feature items, then I can match them against your reference prices.",
                    ]
                )
            ) + example_line
            return ToolExecutionResult(
                tool_name="feature_pricing_quote",
                text=guidance,
                context=guidance,
                metadata={
                    "status": "needs_input",
                    "mode": "feature_breakdown",
                    "question": question,
                    "loadedFromIntentProfile": bool(profile_catalog),
                },
            )

        references: dict[str, float] = {
            key: _as_float(details.get("price"), -1) for key, details in profile_catalog.items()
        }
        references.update(_as_reference_prices(arguments.get("referencePrices")))

        line_items: list[dict[str, object]] = []
        missing_features: list[str] = []
        matched_total = 0.0
        used_project_references: list[dict[str, str]] = []

        for module in modules:
            module_name = str(module["name"] or "General")
            features = cast(list[str], module["features"])

            for feature in features:
                if not feature.strip():
                    continue
                normalized_feature = _normalize_key(feature)
                price = references.get(normalized_feature)
                if price is None:
                    missing_features.append(feature.strip())
                    continue

                related_projects: list[dict[str, str]] = []
                related_project_slugs = cast(
                    list[str],
                    profile_catalog.get(normalized_feature, {}).get("relatedProjectSlugs", []),
                )
                for slug in related_project_slugs:
                    project_reference = project_lookup.get(slug)
                    if project_reference and project_reference not in used_project_references:
                        used_project_references.append(project_reference)
                    if project_reference:
                        related_projects.append(project_reference)

                price_value = float(price)
                matched_total += price_value
                line_items.append(
                    {
                        "module": module_name,
                        "feature": feature.strip(),
                        "price": price_value,
                        "notes": profile_catalog.get(normalized_feature, {}).get("notes", ""),
                        "relatedProjects": related_projects,
                    }
                )

        text_lines = [
            (
                f"Rincian penawaran fitur freelance ({currency.upper()}):"
                if is_indonesian
                else f"Freelance feature quote breakdown ({currency.upper()}):"
            ),
        ]

        if project_name:
            text_lines.append(f"- {'Proyek' if is_indonesian else 'Project'}: {project_name}")
        if requirements_summary:
            requirements_label = "Ringkasan kebutuhan" if is_indonesian else "Requirement summary"
            text_lines.append(f"- {requirements_label}: {requirements_summary}")
        profile_hourly_rate = _as_float(profile.get("hourlyRate"), -1)
        if profile_hourly_rate >= 0:
            hourly_rate = _format_currency(profile_hourly_rate, currency)
            hourly_rate_label = (
                "Rate per jam referensi" if is_indonesian else "Reference hourly rate"
            )
            text_lines.append(f"- {hourly_rate_label}: {hourly_rate}")
        profile_completed_projects = int(_as_float(profile.get("completedProjects"), -1))
        if profile_completed_projects >= 0:
            completed_projects_label = (
                "Proyek freelance selesai di profil"
                if is_indonesian
                else "Completed freelance projects in profile"
            )
            text_lines.append(f"- {completed_projects_label}: {profile_completed_projects}")

        if line_items:
            text_lines.append(
                "- Item referensi yang cocok:" if is_indonesian else "- Matched reference items:"
            )
            for item in line_items:
                line_total = _format_currency(_as_float(item["price"], 0), currency)
                related_projects = cast(
                    list[dict[str, str]],
                    item.get("relatedProjects", []),
                )
                related_suffix = ""
                if related_projects:
                    related_titles = [
                        str(project.get("title"))
                        for project in related_projects
                        if project.get("title")
                    ]
                    if related_titles:
                        related_suffix = (
                            f" (proyek terkait: {', '.join(related_titles)})"
                            if is_indonesian
                            else f" (related projects: {', '.join(related_titles)})"
                        )
                text_lines.append(
                    f"  - {item['module']}: {item['feature']} = {line_total}{related_suffix}"
                )
            subtotal_label = (
                "Subtotal penawaran saat ini" if is_indonesian else "Current quoted subtotal"
            )
            text_lines.append(f"- {subtotal_label}: {_format_currency(matched_total, currency)}")
        else:
            text_lines.append(
                "- Belum ada fitur modul yang cocok dengan katalog referensi saat ini."
                if is_indonesian
                else "- No module features matched the current reference catalog yet."
            )

        if missing_features:
            text_lines.append(
                "- Harga referensi yang masih belum ada untuk:"
                if is_indonesian
                else "- Missing reference prices for:"
            )
            for feature in missing_features:
                text_lines.append(f"  - {feature}")
            text_lines.append(
                " ".join(
                    [
                        "- Tambahkan harga referensi untuk fitur yang masih kosong, lalu",
                        "jalankan ulang rincian ini untuk mendapatkan penawaran final.",
                    ]
                )
                if is_indonesian
                else " ".join(
                    [
                        "- Add reference prices for the missing features, then rerun the",
                        "breakdown to get a final quote.",
                    ]
                )
            )

        pricing_notes = _as_string(profile.get("pricingNotes"))
        if pricing_notes:
            text_lines.append(
                f"- {'Catatan pricing' if is_indonesian else 'Pricing notes'}: {pricing_notes}"
            )

        text_lines.append(
            " ".join(
                [
                    "- Model pricing: penawaran berbasis modul/fitur menggunakan katalog",
                    "referensi freelance Anda, bukan estimasi rate generik.",
                ]
            )
            if is_indonesian
            else " ".join(
                [
                    "- Pricing model: module/feature-based quoting using your freelance",
                    "reference catalog instead of generic rate estimation.",
                ]
            )
        )

        context = (
            f"Tool result from feature_pricing_quote. Module-feature pricing mode. "
            f"Matched subtotal: {_format_currency(matched_total, currency)}. "
            f"Matched items: {len(line_items)}. Missing references: {len(missing_features)}."
        )

        return ToolExecutionResult(
            tool_name="feature_pricing_quote",
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
                "loadedFromIntentProfile": bool(profile_catalog),
                "hourlyRate": None if profile_hourly_rate < 0 else profile_hourly_rate,
                "completedProjects": (
                    None if profile_completed_projects < 0 else profile_completed_projects
                ),
                "projectReferencesUsed": used_project_references,
            },
        )
