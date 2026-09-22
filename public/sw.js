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

// CodeSage Offline Cache & Background Asset Service Worker
// Automatically caches critical frontend assets, routes, scripts and styles
// so subsequent visits and navigations load instantly from cache even offline.

const CACHE_VERSION = 'codesage-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
];

// Install: pre-cache root and essential shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Service worker pre-cache warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_VERSION) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Stale-While-Revalidate / Cache-First strategy for JavaScript & Styles
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-GET, chrome-extension, and API/Supabase calls
  if (
    request.method !== 'GET' ||
    !request.url.startsWith('http') ||
    request.url.includes('/functions/v1') ||
    request.url.includes('supabase.co') ||
    request.url.includes('api.groq.com')
  ) {
    return;
  }

  // For JS chunks, CSS, fonts, and assets: Cache First with background refresh
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font' ||
    request.destination === 'image' ||
    request.url.includes('/assets/')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch fresh copy in background to update cache
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_VERSION).then((cache) => {
                  cache.put(request, networkResponse.clone());
                });
              }
            })
            .catch(() => {});
          return cachedResponse;
        }

        // Not cached yet: fetch from network and cache it
        return fetch(request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        });
      })
    );
    return;
  }

  // For HTML navigation: Network First with Cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(request, copy);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match('/');
        })
    );
  }
});
