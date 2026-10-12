import pytest

from app import create_app


@pytest.fixture
def client():
    app = create_app("testing")
    app.config.update(LLM_API_KEY="test-key", LLM_MODEL="test-model")
    return app.test_client()


def test_health(client):
    body = client.get("/api/health").get_json()
    assert body["ok"] and body["data"]["status"] == "ok" and body["data"]["assistant_configured"] is True


def test_unknown_route_is_json_404(client):
    res = client.get("/api/nope")
    assert res.status_code == 404 and res.get_json()["ok"] is False


def test_chat_requires_message(client):
    assert client.post("/api/assistant/chat", json={"message": "  "}).status_code == 400


def test_chat_rejects_long_message(client):
    assert client.post("/api/assistant/chat", json={"message": "x" * 1001}).status_code == 400


def test_chat_unconfigured_returns_503():
    app = create_app("testing")
    res = app.test_client().post("/api/assistant/chat", json={"message": "hello"})
    assert res.status_code == 503 and res.get_json()["error"]["code"] == "assistant_not_configured"


def test_chat_success_with_mocked_llm(client, monkeypatch):
    monkeypatch.setattr("app.routes.assistant.generate_reply", lambda m, h, p: "Stay calm.")
    res = client.post("/api/assistant/chat", json={"message": "flood tips", "location": {"name": "Delhi"}})
    assert res.get_json()["data"]["reply"] == "Stay calm."


def test_places_validates_coordinates(client):
    assert client.get("/api/places?lat=999&lon=0").status_code == 400
    assert client.get("/api/places?lon=0").status_code == 400


def test_places_reports_live_then_cached(client, monkeypatch):
    sample = [{"id": "node/1", "kind": "hospital", "name": "Test", "lat": 1, "lon": 1, "phone": None, "url": "u"}]
    monkeypatch.setattr("app.services.geo.fetch_places", lambda lat, lon, r: sample)
    first = client.get("/api/places?lat=12.34&lon=56.78").get_json()
    second = client.get("/api/places?lat=12.34&lon=56.78").get_json()
    assert first["meta"]["provenance"] == "live"
    assert second["meta"]["provenance"] == "cached" and second["meta"]["fetched_at"]


def test_wildfires_not_configured_returns_503(client):
    res = client.get("/api/wildfires?lat=20&lon=80")
    assert res.status_code == 503 and res.get_json()["error"]["code"] == "not_configured"


def test_wildfires_with_mocked_firms(client, monkeypatch):
    client.application.config["FIRMS_MAP_KEY"] = "k"
    monkeypatch.setattr("app.services.firms.fetch_hotspots", lambda la, lo, r, k: [{"lat": 1.0, "lon": 2.0}])
    body = client.get("/api/wildfires?lat=20.5&lon=80.5").get_json()
    assert body["data"]["count"] == 1 and "not confirmed" in body["meta"]["disclaimer"]
