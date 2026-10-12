"""NASA FIRMS active-fire hotspots (satellite detections, NOT confirmed fires)."""
import csv
import io
import math

import requests

from ..utils.cache import TTLCache

firms_cache = TTLCache(900)  # FIRMS NRT data updates every few hours; 15 min avoids hammering it


def fetch_hotspots(lat: float, lon: float, radius_km: float, map_key: str) -> list[dict]:
    dlat = radius_km / 111.0
    dlon = dlat / max(0.2, math.cos(math.radians(lat)))
    area = f"{lon - dlon:.3f},{lat - dlat:.3f},{lon + dlon:.3f},{lat + dlat:.3f}"  # west,south,east,north
    url = f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/{map_key}/VIIRS_SNPP_NRT/{area}/1"
    r = requests.get(url, timeout=25)
    r.raise_for_status()
    first = r.text.splitlines()[0] if r.text else ""
    if "latitude" not in first:  # FIRMS answers invalid keys with plain text, not CSV
        raise RuntimeError("FIRMS did not return CSV data")
    out = []
    for row in csv.DictReader(io.StringIO(r.text)):
        try:
            out.append({"lat": float(row["latitude"]), "lon": float(row["longitude"]), "date": row.get("acq_date"),
                        "time": row.get("acq_time"), "confidence": row.get("confidence"), "frp": row.get("frp")})
        except (KeyError, ValueError):
            continue
    return out[:200]
