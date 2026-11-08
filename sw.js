/* ============================================
   Calc+ — Service Worker v1.1
   Funciona completamente sin internet
   ============================================ */

const CACHE_VERSION = 'v1.4';
const CACHE_NAME = `calcplus-${CACHE_VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './apple-touch-icon.png',
  './icon-72x72.png',
  './icon-96x96.png',
  './icon-128x128.png',
  './icon-144x144.png',
  './icon-152x152.png',
  './icon-180x180.png',
  './icon-192x192.png',
  './icon-384x384.png',
  './icon-512x512.png',
];

/* ── Instalación: cachear todos los archivos ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ── Activación: eliminar cachés viejos ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch: Cache First, Network Fallback ── */
self.addEventListener('fetch', event => {
  // Solo manejar peticiones GET
  if (event.request.method !== 'GET') return;

  // Tipos de cambio: red primero, caché solo sin internet
  if (event.request.url.indexOf('open.er-api.com') !== -1) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, clone); });
        }
        return response;
      }).catch(function() { return caches.match(event.request); })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request)
        .then(response => {
          if (!response || response.status !== 200 || response.type === 'opaque') {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          // Fallback offline para navegación
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response(
            '<h1>Sin conexión</h1><p>Calc+ funciona offline. Recarga cuando tengas conexión.</p>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        });
    })
  );
});

/* ── Mensaje para forzar actualización ── */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
