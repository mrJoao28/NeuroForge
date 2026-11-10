# Private API deployment guardrails

The training endpoint requires `NEUROFORGE_API_KEY` and uses a **per-process** fixed-window rate limiter (default: 10 authorized training requests per 60 seconds per client IP). Run **one API worker** for predictable limits. Do not trust forwarded client-IP headers unless a trusted proxy normalizes them. Set a long random API key in the API and Next.js environments.

This is **not public production authentication**: the Next.js `/api/train` endpoint is still accessible to anonymous browsers and forwards the server-side key. Do not expose the web frontend publicly before adding user authentication and distributed rate limiting / quotas. Use TLS for all traffic and avoid logging secrets.
