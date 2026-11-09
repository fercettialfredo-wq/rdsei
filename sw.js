// Cambia la versión cada vez que hagas un cambio en tus archivos (ej. v12, v13...)
const CACHE_NAME = 'Ravens-Access-v12';

const assets = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. Instalar y cachear recursos estáticos
self.addEventListener('install', event => {
  // Fuerza a que este nuevo Service Worker se instale de inmediato
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// 2. Activar y limpiar cachés antiguos (Garantiza que los usuarios vean la última versión)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => {
      // Toma el control de las pestañas abiertas inmediatamente sin recargar
      return self.clients.claim(); 
    })
  );
});

// 3. Interceptar peticiones (Solo internet, cero colas offline)
self.addEventListener('fetch', event => {
  // Si la petición NO es GET (ej. POST a tu Azure Proxy o Twilio para enviar mensajes), 
  // va directo a internet sin tocar el caché.
  if (event.request.method !== 'GET') {
    return; 
  }

  // Estrategia "Network First": Siempre intenta ir a internet primero para tener lo más reciente.
  // Solo usa el caché como un respaldo de emergencia para que la interfaz cargue.
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // Si la red falla por completo, muestra lo que está guardado
        return caches.match(event.request);
      })
  );
});
