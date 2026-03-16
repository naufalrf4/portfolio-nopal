from collections.abc import Mapping
from typing import Any

from fastapi.responses import ORJSONResponse


def success_response(data: Any, status_code: int = 200) -> ORJSONResponse:
    return ORJSONResponse({'success': True, 'data': data}, status_code=status_code)


def error_response(message: str, status_code: int, code: str) -> ORJSONResponse:
    return ORJSONResponse(
        {'success': False, 'error': {'message': message, 'code': code}},
        status_code=status_code,
    )


def detail_from_exception(message: str, code: str, extra: Mapping[str, Any] | None = None) -> dict[str, Any]:
    detail: dict[str, Any] = {'message': message, 'code': code}
    if extra:
        detail.update(extra)
    return detail
