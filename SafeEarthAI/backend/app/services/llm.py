"""Provider-agnostic LLM facade. Gemini is implemented; the API key never leaves the server."""
import requests
from flask import current_app

from ..utils.errors import APIError

SYSTEM_PROMPT = """You are SafeEarth Assistant, a disaster-preparedness guide for people in India.
Rules:
- Give short, practical safety guidance in simple Markdown (bold key actions, short bullet lists).
- You have NO live data. Never claim to know current alerts, river levels, facility availability, or phone numbers other than India's national emergency number 112.
- You cannot contact or dispatch emergency services. Never say help is on the way.
- If someone describes an active emergency, tell them to call 112 first and follow local authorities.
- Do not invent places, contacts, or statistics. If unsure, say so and point to official sources (NDMA, IMD, the state disaster management authority, local authorities).
- Decline requests unrelated to safety and preparedness."""

FALLBACK = "I couldn't produce a safe answer to that. For emergencies call **112**; otherwise try rephrasing your question."


def generate_reply(message: str, history: list[dict], place: str) -> str:
    cfg = current_app.config
    if cfg["LLM_PROVIDER"] != "gemini":
        raise APIError("The configured LLM provider is not supported.", 501, "provider_unsupported")
    if not cfg["LLM_API_KEY"] or not cfg["LLM_MODEL"]:
        raise APIError("The AI assistant is not configured on the server.", 503, "assistant_not_configured")

    history = list(history)
    while history and history[0]["role"] == "assistant":  # conversations should start with the user
        history.pop(0)
    contents = [{"role": "user" if m["role"] == "user" else "model", "parts": [{"text": m["content"]}]} for m in history]
    contents.append({"role": "user", "parts": [{"text": message}]})
    system = SYSTEM_PROMPT + (f"\nThe user selected this location in the app: {place}." if place else "")

    try:
        r = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/{cfg['LLM_MODEL']}:generateContent",
            headers={"x-goog-api-key": cfg["LLM_API_KEY"], "Content-Type": "application/json"},
            json={"system_instruction": {"parts": [{"text": system}]}, "contents": contents,
                  "generationConfig": {"maxOutputTokens": 700, "temperature": 0.4}},
            timeout=30,
        )
    except requests.RequestException as e:
        current_app.logger.error("Gemini request failed: %s", type(e).__name__)
        raise APIError("The AI service could not be reached.", 502, "assistant_unavailable")

    if r.status_code != 200:
        current_app.logger.error("Gemini returned HTTP %s", r.status_code)  # body not logged: may echo user text
        raise APIError("The AI service returned an error.", 502, "assistant_unavailable")
    try:
        parts = r.json()["candidates"][0]["content"]["parts"]
        text = "".join(p.get("text", "") for p in parts).strip()
    except (KeyError, IndexError, TypeError, ValueError):
        text = ""
    return text or FALLBACK
