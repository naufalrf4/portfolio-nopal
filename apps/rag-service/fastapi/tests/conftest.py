import sys
from pathlib import Path

FASTAPI_ROOT = Path(__file__).resolve().parents[1]

if str(FASTAPI_ROOT) not in sys.path:
    sys.path.insert(0, str(FASTAPI_ROOT))
