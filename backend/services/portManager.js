// Simple in-memory port allocation - replace with persistent store for production
import config from '../config/index.js';

const allocated = new Set();

export function reservePort() {
  for (let p = config.publicPortStart; p <= config.publicPortEnd; p++) {
    if (!allocated.has(p)) {
      allocated.add(p);
      return p;
    }
  }
  throw new Error('No available ports');
}

export function freePort(port) {
  allocated.delete(Number(port));
}

export function listAllocated() {
  return Array.from(allocated);
}
