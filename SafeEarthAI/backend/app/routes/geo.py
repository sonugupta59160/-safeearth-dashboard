"""GET /api/geocode and GET /api/places"""
from flask import Blueprint, current_app, request

from ..services import geo
from ..utils.cache import cached_fetch
from ..utils.errors import APIError
from ..utils.provenance import data_response

bp = Blueprint("geo", __name__, url_prefix="/api")


def number_arg(name: str, lo: float, hi: float, default=None) -> float:
    raw = request.args.get(name)
    if raw is None and default is not None:
        return default
    try:
        value = float(raw)
    except (TypeError, ValueError):
        raise APIError(f"'{name}' must be a number.", 400, "invalid_parameter")
    if not lo <= value <= hi:
        raise APIError(f"'{name}' must be between {lo} and {hi}.", 400, "invalid_parameter")
    return value


@bp.get("/geocode")
def geocode():
    q = (request.args.get("q") or "").strip()
    if not 3 <= len(q) <= 80:
        raise APIError("Query must be 3 to 80 characters.", 400, "invalid_parameter")
    try:
        data, prov, at = cached_fetch(geo.geocode_cache, q.lower(), lambda: geo.geocode_india(q))
    except Exception as e:
        current_app.logger.error("Geocoding failed: %s", type(e).__name__)
        raise APIError("Place search is temporarily unavailable.", 502, "upstream_unavailable")
    return data_response(data, provenance=prov, source="OpenStreetMap Nominatim", source_url="https://nominatim.org", fetched_at=at)


@bp.get("/places")
def places():
    lat, lon = number_arg("lat", -90, 90), number_arg("lon", -180, 180)
    radius = int(number_arg("radius", 1000, 25000, default=10000))
    key = f"{round(lat, 2)}:{round(lon, 2)}:{radius}"
    try:
        data, prov, at = cached_fetch(geo.places_cache, key, lambda: geo.fetch_places(lat, lon, radius))
    except Exception as e:
        current_app.logger.error("Overpass request failed: %s", type(e).__name__)
        raise APIError("Facility data is temporarily unavailable.", 502, "upstream_unavailable")
    return data_response(
        {"places": data, "count": len(data)}, provenance=prov, source="OpenStreetMap (Overpass API)",
        source_url="https://www.openstreetmap.org", fetched_at=at,
        disclaimer="Community-maintained OpenStreetMap data. It can be incomplete or outdated. Confirm availability by phone.",
    )
