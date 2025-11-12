# Dockerverse Frontend - Setup & Integration Guide

## Quick Start

The frontend is a Next.js 15 app built with TypeScript, React 18, and Tailwind CSS.

### Setup

1. **Install dependencies:**
   ```powershell
   npm install
   # or
   pnpm install
   ```

2. **Create `.env.local` for local development:**
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
   ```

3. **Start dev server:**
   ```powershell
   npm run dev
   # or
   pnpm dev
   ```

   Opens at `http://localhost:3000`

---

## Architecture

### File Structure

```
src/
├── app/
│   ├── globals.css       # Global Tailwind styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page (renders Tabs)
├── components/
│   ├── Tabs.tsx          # Main orchestrator (state + modals)
│   ├── home.tsx          # Home tab content
│   ├── pods.tsx          # Pods (containers) tab
│   ├── image.tsx         # Images tab
│   ├── settings.tsx      # Settings tab
│   ├── Modal.tsx         # Reusable modal wrapper
│   ├── CreateContainerModal.tsx   # Create container form
│   └── AddImageModal.tsx          # Add/pull image form
└── lib/
    └── api.ts            # API client utilities
```

### Component Hierarchy

```
Tabs (state orchestrator)
├── HomeTab
├── PodsTab
├── ImagesTab
├── SettingsTab
├── Modal (container details)
├── CreateContainerModal (form)
└── AddImageModal (form)
```

---

## API Client (`src/lib/api.ts`)

All backend calls go through the API client:

```typescript
import api from '@/lib/api';

// Fetch images (returns string list of image:tag)
const imageTags = await api.fetchImageTags();

// Fetch raw images from backend
const raw = await api.fetchImagesRaw();

// Pull image from Docker Hub
await api.pullImage('postgres', '15');

// Fetch all containers
const containers = await api.fetchContainers();

// Create and start a container
await api.createContainer({ name: 'my-app', image: 'node:18', port: '8080' });

// Delete container
await api.deleteContainer('container-id');

// Delete image
await api.deleteImage('image-id');
```

**Backend URL:** Set via `NEXT_PUBLIC_BACKEND_URL` env variable (defaults to `http://localhost:3001`).

---

## UI Flows

### Home Tab
- Shows running containers and recent images
- **"Create New Container"** button → Opens `CreateContainerModal`
- Click container to view details and logs

### Pods Tab
- Shows all containers (running + stopped)
- **"New Pod"** button → Opens `CreateContainerModal`
- View/delete containers

### Images Tab
- Shows all pulled images with tags
- **"Add Image"** button → Opens `AddImageModal`
- Delete entire images or individual tags

### Settings Tab
- Simple self-hosting config (port, domain)
- No user profile section

---

## Modal Components

### CreateContainerModal

**Props:**
```typescript
{
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; image: string; port: string }) => void;
  availableImages?: string[];  // Image list from backend
}
```

**Flow:**
1. User clicks "Create Container" or "New Pod"
2. Modal opens with form fields (name, image dropdown, port)
3. User submits → calls `onSubmit` handler
4. `Tabs.tsx` calls `api.createContainer()` to backend
5. On success, refreshes container list
6. Modal closes

### AddImageModal

**Props:**
```typescript
{
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { repository: string; version: string }) => void;
}
```

**Flow:**
1. User clicks "Add Image"
2. Modal opens with form (repository name, version)
3. User submits → calls `onSubmit` handler
4. `Tabs.tsx` calls `api.pullImage()` to backend
5. Backend pulls from Docker Hub
6. On success, refreshes image list
7. Modal closes

### Modal

**Reusable modal wrapper used by:**
- Container details view
- Any future modals

---

## State Management

All state lives in `Tabs.tsx` (no Redux/Zustand, just React hooks):

```typescript
const [active, setActive] = useState<number>(0);              // Active tab
const [containers, setContainers] = useState<Container[]>([]); // Container list
const [images, setImages] = useState<DockerImage[]>([]);      // Image list
const [openContainerId, setOpenContainerId] = useState<string | null>(null); // Details modal
const [showCreateContainerModal, setShowCreateContainerModal] = useState(false);
const [showAddImageModal, setShowAddImageModal] = useState(false);
```

**Data fetching:** `useEffect` on mount fetches containers + images, then polls every 5 seconds.

---

## Type Definitions

```typescript
type Container = {
  id: string;
  name: string;
  image: string;
  status: "initializing" | "running" | "stopped";
  logs: string[];
  createdAt: number;
  ports?: string[];  // e.g., ["8080:3000", "5432:5432"]
};

type DockerImage = {
  id: string;
  name: string;
  tags: string[];  // e.g., ["18", "latest", "18-alpine"]
};
```

---

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| NEXT_PUBLIC_BACKEND_URL | `http://localhost:3001` | Backend API base URL |

**Note:** Prefix with `NEXT_PUBLIC_` to expose to browser (for security, only non-sensitive URLs).

---

## Features

### ✅ Implemented
- Tab-based UI (Home, Pods, Images, Settings)
- View container list + details + logs
- Create containers (with image dropdown from backend)
- Delete containers
- Pull images from Docker Hub
- Delete images
- Real-time data refresh (5-sec polling)
- Dark mode support (Tailwind `dark:` classes)
- Fully typed (TypeScript)

### 🔄 In Progress / TODO
- WebSocket/SSE for real-time logs (currently polling)
- Container start/stop/restart actions
- Image tag deletion via backend API
- Loading spinners + error toast notifications
- Progressive image pull progress indicator

---

## Troubleshooting

### Backend URL Mismatch

**Error:** `CORS error` or `Failed to fetch`

**Fix:** Ensure `NEXT_PUBLIC_BACKEND_URL` matches your backend address:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

And backend has CORS enabled (check `server.js`).

### Images dropdown empty

**Cause:** Backend not returning images yet (no images pulled locally).

**Fix:** Use "Add Image" button to pull an image first, then images appear in dropdown.

### Modal won't close

**Cause:** Form validation error (empty required fields).

**Fix:** Fill in all required fields before submitting.

---

## Build & Deploy

### Build for production:

```powershell
npm run build
npm start
```

### Docker deployment:

```dockerfile
# See Dockerfile in root (if created)
```

---

## Development Tips

1. **Check API calls:** Open DevTools → Network tab to see requests to backend.
2. **Check console:** Console logs show API errors and warnings.
3. **Reset state:** Refresh page to reload containers/images from backend.
4. **Mock data:** Temporarily replace API calls in `src/lib/api.ts` to return hardcoded data for UI testing.

---

## Next Steps

1. **Start backend:** `cd backend && npm install && npm run dev`
2. **Start frontend:** `npm run dev` (in root)
3. **Test:** Create a container via UI, check it appears in backend + frontend
4. **Add auth:** Secure API calls with token from `ADMIN_TOKEN` env var
5. **Stream logs:** Upgrade log fetching to WebSocket for real-time updates
6. **Deploy:** Use Vercel (frontend) + VPS/Docker (backend)

---

## Useful Commands

```powershell
# Start dev
npm run dev

# Build
npm run build

# Start production
npm start

# Lint (if configured)
npm run lint

# Format (if configured)
npm run format
```

---

## Architecture Diagram

```
Browser (Next.js Frontend)
    ↓
fetch() calls (http://localhost:3001)
    ↓
Express Backend
    ↓
dockerode library
    ↓
Docker Daemon (/var/run/docker.sock or tcp)
```

All API responses are JSON. Errors return status codes + error messages.
