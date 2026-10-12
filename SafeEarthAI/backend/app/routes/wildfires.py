"""GET /api/wildfires: NASA FIRMS satellite hotspots near a point."""
from flask import Blueprint, current_app

from ..services import firms
from ..utils.cache import cached_fetch
from ..utils.errors import APIError
from ..utils.provenance import data_response
from .geo import number_arg

bp = Blueprint("wildfires", __name__, url_prefix="/api")


@bp.get("/wildfires")
def wildfires():
    key = current_app.config["FIRMS_MAP_KEY"]
    if not key:
        raise APIError("Wildfire data is not configured (FIRMS_MAP_KEY is missing).", 503, "not_configured")
    lat, lon = number_arg("lat", -90, 90), number_arg("lon", -180, 180)
    radius = number_arg("radius_km", 10, 300, default=100)
    ck = f"{round(lat, 1)}:{round(lon, 1)}:{int(radius)}"
    try:
        data, prov, at = cached_fetch(firms.firms_cache, ck, lambda: firms.fetch_hotspots(lat, lon, radius, key))
    except Exception as e:  # log only the type: the exception text can contain the URL with the key
        current_app.logger.error("FIRMS request failed: %s", type(e).__name__)
        raise APIError("Wildfire data is temporarily unavailable.", 502, "upstream_unavailable")
    return data_response(
        {"hotspots": data, "count": len(data)}, provenance=prov, source="NASA FIRMS (VIIRS S-NPP NRT)",
        source_url="https://firms.modaps.eosdis.nasa.gov", fetched_at=at,
        disclaimer="Satellite heat detections, not confirmed fires.",
    )
