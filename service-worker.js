const CACHE_NAME = 'cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favoritos.html',
  '/historial.html',
  '/styles/main.css',
  '/app.js/main.js',
  '/imagenes/icon.png',
  '/imagenes/logo.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    }).catch(function(error) {
      console.error('Error al intentar agregar recursos al caché:', error);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response; // Si el recurso está en caché, responder con él
      }

      // Si el recurso no está en caché, intentar recuperarlo de la red
      return fetch(event.request).then(function(networkResponse) {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Clonar la respuesta recibida
        const clonedResponse = networkResponse.clone();

        // Almacenar la respuesta en el caché
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, clonedResponse);
        });

        // Responder con la respuesta de la red
        return networkResponse;
      }).catch(function(error) {
        console.error('Fetch fallido:', error);
        // Opcional: responder con una página de error u otro recurso
      });
    })
  );
});
