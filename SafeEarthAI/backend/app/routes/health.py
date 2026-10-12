from flask import Blueprint, current_app

from ..utils.provenance import success

bp = Blueprint("health", __name__, url_prefix="/api")


@bp.get("/health")
def health():
    cfg = current_app.config
    return success({
        "status": "ok", "service": "safeearth-ai-backend", "version": cfg["APP_VERSION"], "environment": cfg["APP_ENV"],
        # Which optional integrations are configured (never the keys themselves)
        "assistant_configured": bool(cfg["LLM_API_KEY"] and cfg["LLM_MODEL"]),
        "wildfires_configured": bool(cfg["FIRMS_MAP_KEY"]),
    })
