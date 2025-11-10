# Frontend API Integration Guide

This document shows how to wire up the frontend components with backend API calls.

## Current State

The frontend (`Tabs.tsx`, `home.tsx`, `pods.tsx`, `image.tsx`, `settings.tsx`) currently has:
- ✅ Full UI structure and layout
- ✅ Delete functions stubbed out with `console.log` placeholders
- ✅ Clean component composition
- ❌ No real API calls (waiting for backend)

## How to Connect to Backend

### 1. Update Container Creation (Home Tab)

**File:** `src/components/Tabs.tsx`

**Current:**
```typescript
function createContainer() {
  console.log("Create container - awaiting backend implementation");
}
```

**Replace with:**
```typescript
async function createContainer() {
  try {
    const response = await fetch("/api/containers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: "alpine:latest", // TODO: Get from form input
        name: "container-" + Date.now(),
        ports: [], // TODO: Get from form
      }),
    });
    const data = await response.json();
    
    // Add new container to state
    setContainers((s) => [
      {
        id: data.id,
        name: data.name,
        image: data.image,
        status: data.status,
        logs: data.logs || [],
        createdAt: Date.now(),
        ports: data.ports,
      },
      ...s,
    ]);
    
    // Show logs modal
    setOpenContainerId(data.id);
    
    // Start polling/streaming logs
    streamContainerLogs(data.id);
  } catch (error) {
    console.error("Failed to create container:", error);
  }
}
```

### 2. Update Container Deletion

**File:** `src/components/Tabs.tsx`

**Current:**
```typescript
function deleteContainer(containerId: string) {
  setContainers((s) => s.filter((c) => c.id !== containerId));
  setOpenContainerId(null);
  console.log("Delete container - awaiting backend implementation");
}
```

**Replace with:**
```typescript
async function deleteContainer(containerId: string) {
  try {
    const response = await fetch(`/api/containers/${containerId}`, {
      method: "DELETE",
    });
    
    if (response.ok) {
      setContainers((s) => s.filter((c) => c.id !== containerId));
      setOpenContainerId(null);
    } else {
      console.error("Failed to delete container");
    }
  } catch (error) {
    console.error("Error deleting container:", error);
  }
}
```

### 3. Update Delete Image & Tag

**File:** `src/components/Tabs.tsx`

**Current:**
```typescript
function deleteImageTag(imageId: string, tag: string) {
  setImages((s) =>
    s.map((img) =>
      img.id === imageId
        ? { ...img, tags: img.tags.filter((t) => t !== tag) }
        : img
    ).filter((img) => img.tags.length > 0)
  );
  console.log("Delete image tag - awaiting backend implementation");
}

function deleteImage(imageId: string) {
  setImages((s) => s.filter((img) => img.id !== imageId));
  console.log("Delete image - awaiting backend implementation");
}
```

**Replace with:**
```typescript
async function deleteImageTag(imageId: string, tag: string) {
  try {
    const response = await fetch(`/api/images/${imageId}/tags/${tag}`, {
      method: "DELETE",
    });
    
    if (response.ok) {
      setImages((s) =>
        s.map((img) =>
          img.id === imageId
            ? { ...img, tags: img.tags.filter((t) => t !== tag) }
            : img
        ).filter((img) => img.tags.length > 0)
      );
    }
  } catch (error) {
    console.error("Error deleting image tag:", error);
  }
}

async function deleteImage(imageId: string) {
  try {
    const response = await fetch(`/api/images/${imageId}`, {
      method: "DELETE",
    });
    
    if (response.ok) {
      setImages((s) => s.filter((img) => img.id !== imageId));
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}
```

### 4. Add useEffect to Fetch Initial Data

Add this to `Tabs.tsx` component:

```typescript
useEffect(() => {
  // Fetch containers on mount
  const fetchContainers = async () => {
    try {
      const response = await fetch("/api/containers");
      const data = await response.json();
      setContainers(data.containers || []);
    } catch (error) {
      console.error("Error fetching containers:", error);
    }
  };

  // Fetch images on mount
  const fetchImages = async () => {
    try {
      const response = await fetch("/api/images");
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  fetchContainers();
  fetchImages();

  // Optionally poll for updates every 5 seconds
  const interval = setInterval(() => {
    fetchContainers();
    fetchImages();
  }, 5000);

  return () => clearInterval(interval);
}, []);
```

### 5. Stream Container Logs (Real-time)

Add this helper function:

```typescript
async function streamContainerLogs(containerId: string) {
  try {
    // Using Server-Sent Events
    const eventSource = new EventSource(`/api/containers/${containerId}/logs/stream`);
    
    eventSource.onmessage = (event) => {
      const log = JSON.parse(event.data).log;
      setContainers((s) =>
        s.map((c) =>
          c.id === containerId
            ? { ...c, logs: [...c.logs, log] }
            : c
        )
      );
    };

    eventSource.onerror = () => {
      eventSource.close();
    };
  } catch (error) {
    console.error("Error streaming logs:", error);
  }
}
```

---

## Backend API Endpoints Required

### Containers

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/containers` | List all containers |
| POST | `/api/containers` | Create new container |
| DELETE | `/api/containers/{id}` | Delete container |
| GET | `/api/containers/{id}/logs` | Get container logs |
| GET | `/api/containers/{id}/logs/stream` | Stream logs (SSE) |

### Images

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/images` | List all images |
| DELETE | `/api/images/{id}` | Delete entire image |
| DELETE | `/api/images/{id}/tags/{tag}` | Delete specific tag |

### User/Settings

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/user` | Get user profile |
| GET | `/api/settings` | Get app settings |
| POST | `/api/settings/domain` | Save domain config |

---

## Response Format Expected

### GET /api/containers

```json
{
  "containers": [
    {
      "id": "abc123def456",
      "name": "my-app",
      "image": "node:18",
      "status": "running",
      "logs": ["[init] pulling image...", "[info] server started"],
      "createdAt": 1699700000000,
      "ports": ["8080:3000", "5432:5432"]
    }
  ]
}
```

### POST /api/containers

```json
{
  "id": "abc123def456",
  "name": "my-app",
  "image": "node:18",
  "status": "initializing",
  "logs": ["[init] creating container..."],
  "createdAt": 1699700000000,
  "ports": ["8080:3000"]
}
```

### GET /api/images

```json
{
  "images": [
    {
      "id": "sha256:abc123...",
      "name": "node",
      "tags": ["18", "latest", "18-alpine"]
    }
  ]
}
```

---

## Testing Without Backend

While backend is being built, you can mock the API:

```typescript
// src/lib/api.mock.ts
export async function fetchContainers() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        containers: [
          {
            id: "mock-1",
            name: "test-container",
            image: "alpine:latest",
            status: "running",
            logs: ["Mock log 1", "Mock log 2"],
            createdAt: Date.now(),
            ports: ["8080:3000"],
          },
        ],
      });
    }, 500);
  });
}
```

Then in `Tabs.tsx`:

```typescript
import { fetchContainers } from "@/lib/api.mock";

useEffect(() => {
  const fetch = async () => {
    const data = await fetchContainers();
    setContainers(data.containers);
  };
  fetch();
}, []);
```

---

## Key Implementation Notes

1. **Loading states** — Add loading spinners while fetching.
2. **Error handling** — Show user-friendly error messages.
3. **Polling vs. WebSocket** — For high-frequency updates, prefer WebSocket over polling.
4. **Timeouts** — Set fetch timeouts to prevent hanging requests.
5. **Caching** — Consider caching container list for 5 seconds to reduce API calls.

---

## Next Steps

1. Build backend routes using the BACKEND_INTEGRATION.md guide.
2. Replace the TODO comments above with real API calls.
3. Test each endpoint with Postman or curl.
4. Add loading/error states to the UI.
5. Implement real-time log streaming with WebSocket or SSE.
