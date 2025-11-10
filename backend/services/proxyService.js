// Lightweight proxy service placeholder. Two options:
// 1) Write Nginx config and reload (recommended for production)
// 2) Use a node http-proxy to forward requests (simpler for dev)

import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({});

export function forward(req, res, target) {
  return new Promise((resolve, reject) => {
    proxy.web(req, res, { target }, (err) => {
      reject(err);
    });
    proxy.on('proxyRes', (proxyRes) => resolve(proxyRes));
  });
}

export default { forward };
