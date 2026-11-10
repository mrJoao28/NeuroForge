from fastapi.testclient import TestClient
from neuroforge_api.main import app

client = TestClient(app)

def test_health():
    assert client.get("/health").json() == {"status": "ok"}

def test_real_training(monkeypatch):
    monkeypatch.setenv("NEUROFORGE_API_KEY", "test-secret")
    data = {"x": [[0.0], [0.5], [1.0]], "y": [[1.0], [2.0], [3.0]], "epochs": 20}
    response = client.post("/v1/train", json=data, headers={"X-Neuroforge-Api-Key": "test-secret"})
    assert response.status_code == 200
    body = response.json()
    assert body["kind"] == "real-training"
    assert len(body["history"]) == 20
    assert body["history"][-1]["train"] >= 0
    assert body["history"][-1]["validation"] is not None
    assert len(body["predictions"]) == 3

def test_invalid_data():
    response = client.post("/v1/train", json={"x": [[1.0], [2.0]], "y": [[1.0]]})
    assert response.status_code == 422
