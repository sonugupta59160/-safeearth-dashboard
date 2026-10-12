"""Every disaster-data response declares its provenance: live, cached, demo or unavailable."""
from datetime import datetime, timezone
from enum import Enum

from flask import jsonify


class Provenance(str, Enum):
    LIVE = "live"
    CACHED = "cached"
    DEMO = "demo"
    UNAVAILABLE = "unavailable"


DEMO_DISCLAIMER = (
    "Demonstration data for UI testing. It is not a real alert, observation, or validated forecast. "
    "Follow guidance from your national and local authorities."
)


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def success(data=None, status: int = 200):
    resp = jsonify({"ok": True, "data": data})
    resp.status_code = status
    return resp


def data_response(data, *, provenance, source, source_url=None, fetched_at=None, disclaimer=None, status=200):
    provenance = Provenance(provenance)
    if provenance is Provenance.DEMO and not disclaimer:
        disclaimer = DEMO_DISCLAIMER
    if provenance is Provenance.CACHED and fetched_at is None:
        raise ValueError("Cached data must state when it was originally fetched.")
    if provenance is Provenance.LIVE and fetched_at is None:
        fetched_at = utc_now_iso()
    resp = jsonify({
        "ok": True,
        "data": data,
        "meta": {"provenance": provenance.value, "source": source, "source_url": source_url,
                 "fetched_at": fetched_at, "served_at": utc_now_iso(), "disclaimer": disclaimer},
    })
    resp.status_code = status
    return resp
