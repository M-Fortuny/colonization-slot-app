const CACHE_NAME = 'autocontrol-v2';
const ASSETS = [
  '/',                  // Abre la raíz (Esencial para Netlify)
  '/index.html',        // Tu HTML único (que ya lleva el CSS y JS dentro)
  '/manifest.json',     // Tu manifiesto
  '/icono-app.png'      // Tu icono principal
];

// Instalar el Service Worker y guardar en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Guardando recursos en caché...');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting()) // Fuerza a que se active de inmediato
  );
});

// Activar y limpiar cachés antiguas (v1)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma el control de la pestaña actual inmediatamente
  );
});

// Intercepta peticiones y sirve desde caché
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si está en caché lo devuelve, si no, lo busca en internet
      return response || fetch(event.request);
    })
  );
});