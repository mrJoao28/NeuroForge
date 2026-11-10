# NeuroForge Experiment Workbench

- Run linear, quadratic and sine experiments using the real Python engine.
- Compare loss curves for runs on the same dataset; missing epochs are gaps rather than interpolated data.
- Inspect best final training MSE and relative reduction during that run.
- Export all retained runs and per-epoch metrics to CSV.
- The most recent 8 runs are stored in the browser's localStorage, not in Supabase or on the server.
- Clear all history to delete locally stored runs. Do not enter private datasets into this demo.

## Checks

From `apps/web`, run `npm install && npm test && npm run lint && npm run build`.

## Security

Browser storage is not suitable for secrets. This feature does not introduce user accounts or server persistence. Public deployments still need user authentication, quotas and a distributed limiter.
