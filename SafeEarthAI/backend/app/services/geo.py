"""OpenStreetMap services: Nominatim (geocoding) and Overpass (hospitals, shelters)."""
import threading
import time

import requests
from flask import current_app

from ..utils.cache import TTLCache

NOMINATIM = "https://nominatim.openstreetmap.org/search"
OVERPASS = "https://overpass-api.de/api/interpreter"

geocode_cache = TTLCache(24 * 3600)
places_cache = TTLCache(3600)

_lock = threading.Lock()
_last_call = [0.0]


def _headers() -> dict:
    return {"User-Agent": current_app.config["APP_USER_AGENT"]}  # required by OSM usage policies


def geocode_india(query: str) -> list[dict]:
    with _lock:  # Nominatim policy: at most 1 request per second
        wait = 1.05 - (time.time() - _last_call[0])
        if wait > 0:
            time.sleep(wait)
        _last_call[0] = time.time()
        r = requests.get(NOMINATIM, params={"q": query, "format": "jsonv2", "countrycodes": "in", "limit": 5},
                         headers=_headers(), timeout=10)
    r.raise_for_status()
    return [{"name": ", ".join(x["display_name"].split(", ")[:3]), "lat": float(x["lat"]), "lon": float(x["lon"])}
            for x in r.json()]


def _overpass_query(lat: float, lon: float, radius: int) -> str:
    a = f"(around:{radius},{lat},{lon})"  # numbers are validated upstream, so the query cannot be injected into
    return ("[out:json][timeout:25];("
            f'nwr["amenity"="hospital"]{a};nwr["emergency"="assembly_point"]{a};nwr["social_facility"="shelter"]{a};'
            ");out center 80;")


def fetch_places(lat: float, lon: float, radius: int) -> list[dict]:
    r = requests.post(OVERPASS, data={"data": _overpass_query(lat, lon, radius)}, headers=_headers(), timeout=30)
    r.raise_for_status()
    places = []
    for e in r.json().get("elements", []):
        tags = e.get("tags", {})
        pos = e.get("center", e)  # nodes carry lat/lon; ways and relations carry center
        if "lat" not in pos:
            continue
        places.append({
            "id": f'{e["type"]}/{e["id"]}',
            "kind": "hospital" if tags.get("amenity") == "hospital" else "shelter",
            "name": tags.get("name") or tags.get("name:en"),
            "lat": pos["lat"], "lon": pos["lon"],
            "phone": tags.get("phone") or tags.get("contact:phone"),
            "url": f'https://www.openstreetmap.org/{e["type"]}/{e["id"]}',
        })
    return places
