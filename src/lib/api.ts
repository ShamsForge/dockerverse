const BASE = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BACKEND_URL ? process.env.NEXT_PUBLIC_BACKEND_URL : 'http://localhost:3001';

async function request(path: string, opts: RequestInit = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, { ...opts });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

export async function fetchImageTags(): Promise<string[]> {
  // convenience wrapper around fetchImagesRaw
  const raw = await fetchImagesRaw();
  // raw -> string list
  const list: string[] = [];
  const arr = Array.isArray(raw) ? raw : raw.images || [];
  arr.forEach((item: any) => {
    if (item.RepoTags && Array.isArray(item.RepoTags)) {
      item.RepoTags.forEach((t: string) => { if (t && t !== '<none>:<none>') list.push(t); });
    } else if (item.name && Array.isArray(item.tags)) {
      item.tags.forEach((tag: string) => list.push(`${item.name}:${tag}`));
    } else if (item.repoTags && Array.isArray(item.repoTags)) {
      item.repoTags.forEach((t: string) => list.push(t));
    }
  });
  return Array.from(new Set(list));
}

export async function fetchImagesRaw() {
  return request('/api/images');
}

export async function pullImage(repository: string, version = 'latest') {
  return request('/api/images/pull', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repository, version }),
  });
}

export async function fetchContainers() {
  const data = await request('/api/containers');
  return Array.isArray(data) ? data : data.containers || [];
}

export async function createContainer(payload: { name: string; image: string; port?: string }) {
  return request('/api/containers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteContainer(id: string) {
  return request(`/api/containers/${id}`, { method: 'DELETE' });
}

export async function deleteImage(id: string) {
  return request(`/api/images/${id}`, { method: 'DELETE' });
}

export default {
  fetchImageTags,
  fetchImagesRaw,
  pullImage,
  fetchContainers,
  createContainer,
  deleteContainer,
  deleteImage,
};
