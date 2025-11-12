# Dockerverse Backend - Complete Setup Guide

## Quick Start

1. **Navigate to backend folder:**
   ```powershell
   cd backend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example` and adjust):
   ```
   PORT=3001
   DOCKER_SOCKET=/var/run/docker.sock
   BASE_DOMAIN=example.com
   PUBLIC_PORT_START=8000
   PUBLIC_PORT_END=8999
   ADMIN_TOKEN=changeme
   ```

4. **Start the server:**
   ```powershell
   npm run dev
   ```

Server will listen on `http://localhost:3001`

---

## Architecture

```
backend/
├── server.js                 # Express app entry
├── config/index.js           # Environment config loader
├── services/
│   ├── dockerService.js      # Docker API wrapper (using dockerode)
│   ├── portManager.js        # Port reservation (in-memory)
│   └── proxyService.js       # HTTP proxy placeholder
├── controllers/
│   ├── containersController.js
│   └── imagesController.js
├── routes/
│   ├── containers.js         # Container endpoints
│   ├── images.js             # Image endpoints
│   └── index.js              # Route mounter
├── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## API Endpoints (Summary)

### Containers

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/containers` | List all containers |
| POST | `/api/containers` | Create and start container |
| POST | `/api/containers/{id}/start` | Start container |
| POST | `/api/containers/{id}/stop` | Stop container |
| POST | `/api/containers/{id}/restart` | Restart container |
| DELETE | `/api/containers/{id}` | Delete container |
| GET | `/api/containers/{id}` | Get container details |
| GET | `/api/containers/{id}/logs?tail=200` | Get logs |

### Images

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/images` | List all local images |
| POST | `/api/images/pull` | Pull image from Docker Hub |
| DELETE | `/api/images/{id}` | Delete image by ID |

---

## API Request/Response Examples

### GET `/api/containers`

**Response (200 OK):**
```json
[
  {
    "Id": "abc123def456...",
    "Names": ["/my-container"],
    "Image": "node:18",
    "State": "running",
    "Status": "Up 5 minutes",
    "Ports": [
      {
        "IP": "0.0.0.0",
        "PrivatePort": 3000,
        "PublicPort": 8080,
        "Type": "tcp"
      }
    ],
    "Created": 1699700000
  }
]
```

### POST `/api/containers`

**Request:**
```json
{
  "name": "my-app",
  "image": "node:18",
  "port": "8080"
}
```

**Response (201 Created):**
```json
{
  "id": "abc123def456...",
  "publicPort": 8001
}
```

### GET `/api/images`

**Response (200 OK):**
```json
[
  {
    "Id": "sha256:abc123...",
    "RepoTags": ["node:18", "node:latest"],
    "Size": 982345678,
    "Created": 1699700000
  },
  {
    "Id": "sha256:def456...",
    "RepoTags": ["alpine:latest"],
    "Size": 7654321,
    "Created": 1699600000
  }
]
```

### POST `/api/images/pull`

**Request:**
```json
{
  "repository": "postgres",
  "version": "15"
}
```

**Response (201 Created):**
```json
{
  "ok": true,
  "repoTag": "postgres:15"
}
```

---

## Docker Socket Setup

### Linux / macOS

The backend connects to Docker via the socket at `/var/run/docker.sock`. Ensure your user/process has permission:

```bash
# Add your user to the docker group (requires logout/login to take effect)
sudo usermod -aG docker $USER
```

### Windows

On Windows, the backend uses the named pipe: `\\.\pipe\docker_engine` (automatically handled by dockerode).

### Docker Desktop

If running Docker Desktop (any OS), update `.env`:
- **Linux/macOS:** The default socket path works.
- **Windows:** Named pipe path is used automatically.

---

## Running with Docker Compose

For local development with Docker Compose:

```powershell
docker-compose up
```

This runs the backend service with the Docker socket mounted. The service exposes port `3001`.

---

## Environment Variables Reference

| Variable | Default | Purpose |
|----------|---------|---------|
| PORT | 3001 | Backend server port |
| DOCKER_SOCKET | `/var/run/docker.sock` | Path to Docker socket (Linux/macOS) |
| DOCKER_HOST | null | Docker TCP host (if not using socket) |
| BASE_DOMAIN | `localhost` | Base domain for public forwarding |
| PUBLIC_PORT_START | 8000 | Start of reserved port range |
| PUBLIC_PORT_END | 8999 | End of reserved port range |
| ADMIN_TOKEN | null | (Optional) Auth token for API calls |

---

## Security Notes

1. **Never expose the Docker socket** or Docker TCP endpoint directly to the internet. Only expose the backend API.
2. **Validate all inputs** in routes before passing to Docker API.
3. **Use a reverse proxy** (Nginx, Caddy) with authentication in front of the backend for production.
4. **Set resource limits** on created containers to prevent runaway resource usage.
5. **Log API calls** to audit container creation/deletion.

---

## Troubleshooting

### Backend fails to start: "connect ENOENT /var/run/docker.sock"

**Cause:** Docker socket not found or permission denied.

**Fix:**
```bash
# Check socket exists
ls -l /var/run/docker.sock

# Ensure user in docker group
id $USER | grep docker
sudo usermod -aG docker $USER
```

### Image pull fails with 404

**Cause:** Repository name not found on Docker Hub.

**Fix:** Verify the image exists:
```bash
docker pull postgres:15  # Test locally first
```

### Port allocation fails

**Cause:** All reserved ports are in use or port range too small.

**Fix:** Adjust `PUBLIC_PORT_START` and `PUBLIC_PORT_END` in `.env` to a larger range.

---

## Next Steps

1. **Frontend Integration:** The Next.js frontend (`src/lib/api.ts`) calls these endpoints. Verify `NEXT_PUBLIC_BACKEND_URL` env var is set correctly.
2. **Authentication:** Add token-based middleware to protect endpoints (see `ADMIN_TOKEN` in `.env`).
3. **Persistent Port Allocation:** Replace in-memory `portManager.js` with Redis or file-based store.
4. **Public Domain Forwarding:** Implement Nginx dynamic config generation or use a reverse-proxy service for public URL exposure.
5. **Real-time Logs:** Upgrade log endpoint to use WebSocket or Server-Sent Events (SSE) for live streaming.
6. **Tests:** Add Jest + supertest integration tests for each endpoint.

---

## Development Commands

```powershell
# Install deps
npm install

# Start (dev mode with nodemon)
npm run dev

# Start (production mode)
npm start

# Lint (placeholder; add ESLint if needed)
npm run lint

# Test (placeholder; add Jest if needed)
npm test
```
