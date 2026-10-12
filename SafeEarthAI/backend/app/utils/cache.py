"""Tiny in-memory TTL cache with stale-if-error. No Redis needed on an 8 GB laptop."""
import threading
import time
from datetime import datetime, timezone


class TTLCache:
    def __init__(self, ttl_seconds: int, max_items: int = 256):
        self.ttl, self.max_items = ttl_seconds, max_items
        self._d: dict = {}
        self._lock = threading.Lock()

    def get(self, key):
        with self._lock:
            return self._d.get(key)  # (value, stored_at_epoch) or None

    def set(self, key, value):
        with self._lock:
            if len(self._d) >= self.max_items:
                self._d.pop(min(self._d, key=lambda k: self._d[k][1]))
            self._d[key] = (value, time.time())


def _iso(ts: float) -> str:
    return datetime.fromtimestamp(ts, timezone.utc).isoformat(timespec="seconds")


def cached_fetch(cache: TTLCache, key, fetch):
    """Return (value, provenance, fetched_at).

    Fresh cache entry -> "cached" with its original fetch time.
    Otherwise fetch   -> "live".
    Upstream failure  -> stale cache entry as "cached", or re-raise if none exists.
    """
    hit = cache.get(key)
    if hit and time.time() - hit[1] < cache.ttl:
        return hit[0], "cached", _iso(hit[1])
    try:
        value = fetch()
    except Exception:
        if hit:
            return hit[0], "cached", _iso(hit[1])
        raise
    cache.set(key, value)
    return value, "live", None
