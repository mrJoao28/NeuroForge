from fastapi.testclient import TestClient
from neuroforge_api.main import app

def test_no_holdout_has_null_validation(monkeypatch):
    monkeypatch.setenv("NEUROFORGE_API_KEY","test-secret")
    client=TestClient(app)
    response=client.post("/v1/train",json={"x":[[0.0],[1.0]],"y":[[1.0],[3.0]],"epochs":2,"validation_fraction":0},headers={"X-Neuroforge-Api-Key":"test-secret"})
    assert response.status_code==200
    assert response.json()["history"][0]["validation"] is None

def test_invalid_fraction_is_rejected():
    client=TestClient(app)
    response=client.post("/v1/train",json={"x":[[0.0],[1.0]],"y":[[1.0],[3.0]],"validation_fraction":0.9})
    assert response.status_code==422
