// Service worker for caching and offline functionality
const CACHE_NAME = 'jdit-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/multi-page.css',
  '/css/optimizations.css',
  '/js/main.js',
  '/js/include-html.js',
  '/js/optimizations.js',
  '/js/service-worker-registration.js',
  '/pages/header.html',
  '/pages/footer.html',
  '/pages/services.html',
  '/pages/technologies.html',
  '/pages/case-studies.html',
  '/pages/about.html',
  '/pages/blog.html',
  '/pages/contact.html',
  '/images/hero-bg.jpg',
  '/images/cta-bg.jpg',
  // Add other important assets to cache
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
