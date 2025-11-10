# Dockerverse Backend

This folder contains a minimal Node/Express backend that exposes Docker management APIs using `dockerode`.

Quick start

1. Copy `.env.example` to `.env` and edit values as needed.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Start the server (ensure Docker socket or TCP is accessible):

```bash
npm run dev
```

API Endpoints (summary)

- GET /api/containers - list containers (running + stopped)
- POST /api/containers - create container { name, image, port }
- POST /api/containers/:id/start
- POST /api/containers/:id/stop
- POST /api/containers/:id/restart
- DELETE /api/containers/:id
- GET /api/containers/:id - inspect
- GET /api/containers/:id/logs?tail=200 - logs

- GET /api/images - list images
- POST /api/images/pull - pull image { repository, version }
- DELETE /api/images/:id - remove image

Notes

- This scaffold uses an in-memory port allocator (`services/portManager.js`) for demo purposes. Persist reservations when moving to production.
- For public access / domain forwarding, consider producing dynamic Nginx configs or using a stable reverse-proxy service. `services/proxyService.js` provides a small placeholder.
- Secure the API with a token or OAuth in production (see `ADMIN_TOKEN` in `.env.example`).
