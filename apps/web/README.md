# NeuroForge web

Run the Python API from the repository root:

```bash
python -m pip install -e ./packages/neuroforge_core
python -m pip install -e './apps/api[test]'
uvicorn neuroforge_api.main:app --port 8000
```

Then start Next.js:

```bash
cd apps/web
cp .env.example .env.local
npm install
npm run dev
```

The server-side Next.js `/api/train` route forwards requests to `NEUROFORGE_API_URL`. The browser does not call the Python API directly, avoiding browser CORS configuration. No authentication or compute quota exists yet: do not expose the training API publicly until safeguards are implemented.
