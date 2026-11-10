from fastapi.testclient import TestClient
from neuroforge_api.main import app

client = TestClient(app)
PAYLOAD = {"x": [[0.0], [1.0]], "y": [[1.0], [3.0]], "epochs": 3}

def test_missing_server_secret_returns_503(monkeypatch):
    monkeypatch.delenv("NEUROFORGE_API_KEY", raising=False)
    assert client.post("/v1/train", json=PAYLOAD).status_code == 503

def test_missing_or_wrong_client_secret_returns_401(monkeypatch):
    monkeypatch.setenv("NEUROFORGE_API_KEY", "test-secret")
    assert client.post("/v1/train", json=PAYLOAD).status_code == 401
    assert client.post("/v1/train", json=PAYLOAD, headers={"X-Neuroforge-Api-Key": "wrong"}).status_code == 401

def test_authorized_training(monkeypatch):
    monkeypatch.setenv("NEUROFORGE_API_KEY", "test-secret")
    response = client.post("/v1/train", json=PAYLOAD, headers={"X-Neuroforge-Api-Key": "test-secret"})
    assert response.status_code == 200
    assert response.json()["kind"] == "real-training"

def test_rejects_expensive_experiment(monkeypatch):
    monkeypatch.setenv("NEUROFORGE_API_KEY", "test-secret")
    payload = {"x": [[0.0] * 64] * 500, "y": [[0.0] * 16] * 500, "epochs": 1000, "hidden_width": 128}
    assert client.post("/v1/train", json=payload, headers={"X-Neuroforge-Api-Key": "test-secret"}).status_code == 422
