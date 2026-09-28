// Monetag Website Verification & Push Service Worker
self.options = {
    "domain": "5gvci.com",
    "zoneId": 11858032
};
self.lary = "";
try {
  importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw');
} catch (e) {
  console.warn('Monetag worker load error:', e);
}

// Clean up any previously cached stale JS/HTML chunks from codesage-v1
// so routes and UserContext modules never collide across deployments.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});
