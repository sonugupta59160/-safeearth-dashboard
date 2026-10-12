"""POST /api/assistant/chat"""
import time
from collections import defaultdict, deque

from flask import Blueprint, request

from ..services.llm import generate_reply
from ..utils.errors import APIError
from ..utils.provenance import success

bp = Blueprint("assistant", __name__, url_prefix="/api/assistant")

_hits: dict[str, deque] = defaultdict(deque)
LIMIT, WINDOW = 20, 60  # 20 requests per minute per IP (in-memory; fine for a single process)


def _rate_limit(ip: str) -> None:
    now, q = time.time(), _hits[ip]
    while q and now - q[0] > WINDOW:
        q.popleft()
    if len(q) >= LIMIT:
        raise APIError("Too many requests. Please wait a minute.", 429, "rate_limited")
    q.append(now)


@bp.post("/chat")
def chat():
    _rate_limit(request.remote_addr or "unknown")
    body = request.get_json(silent=True)
    if not isinstance(body, dict):
        raise APIError("Send a JSON body.", 400, "invalid_json")
    message = body.get("message")
    if not isinstance(message, str) or not message.strip():
        raise APIError("'message' is required.", 400, "invalid_message")
    if len(message) > 1000:
        raise APIError("Message is too long (max 1000 characters).", 400, "invalid_message")

    history = []
    for m in (body.get("history") or [])[-8:]:
        if isinstance(m, dict) and m.get("role") in ("user", "assistant") and isinstance(m.get("content"), str):
            history.append({"role": m["role"], "content": m["content"][:2000]})
    loc = body.get("location") if isinstance(body.get("location"), dict) else {}
    place = str(loc.get("name", ""))[:80]

    reply = generate_reply(message.strip(), history, place)
    return success({"reply": reply, "notice": "AI-generated and may contain errors. Not an official source."})
