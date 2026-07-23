# docker/

Deploy-time infrastructure assets.

- `docker-compose.yml` (repo root) — local/dev stack: MongoDB 7, Redis 7,
  backend image.
- `backend/Dockerfile` — multi-stage production image (non-root user).

This folder will hold environment-specific additions as they become needed:
reverse-proxy config (nginx), MongoDB init scripts, production compose
overrides (`docker-compose.prod.yml`), and CI build helpers. Kept separate
from application code so ops changes never touch `src/`.
