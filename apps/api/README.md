# NeuroForge API

Stateless training API powered by the NumPy engine.

From repository root:

```bash
python -m pip install -e ./packages/neuroforge_core
python -m pip install -e './apps/api[test]'
uvicorn neuroforge_api.main:app --reload --port 8000
```

POST `/v1/train` accepts bounded training data and returns real training metrics. No authentication or persistence is implemented yet. Keep this service private until authentication, rate limiting and compute quotas are added.
