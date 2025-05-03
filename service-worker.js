// Service worker for caching and offline functionality
const CACHE_VERSION = 'v1';
const CACHE_NAME = `jdit-cache-${CACHE_VERSION}`;

// Cache configuration
const CACHE_CONFIG = {
  STATIC: {
    name: `${CACHE_NAME}-static`,
    urls: [
      '/',
      '/index.html',
      '/css/styles.min.css',
      '/css/multi-page.min.css',
      '/js/app.min.js',
      '/js/optimizations.min.js',
      '/js/service-worker-registration.js',
      '/pages/header.html',
      '/pages/footer.html',
      '/pages/services.html',
      '/pages/technologies.html',
      '/pages/case-studies.html',
      '/pages/about.html',
      '/pages/blog.html',
      '/pages/contact.html'
    ]
  },
  IMAGES: {
    name: `${CACHE_NAME}-images`,
    urls: [
      '/images/hero-bg.jpg',
      '/images/cta-bg.jpg',
      '/images/case1.jpg',
      '/images/case2.jpg',
      '/images/case3.jpg',
      '/images/logo.png',
      '/images/favicon.ico'
    ]
  },
  EXTERNAL: {
    name: `${CACHE_NAME}-external`,
    urls: [
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
      'https://unpkg.com/aos@next/dist/aos.css',
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Lato:wght@400;500;700&display=swap'
    ]
  }
};

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all(
      Object.values(CACHE_CONFIG).map(config =>
        caches.open(config.name).then(cache => cache.addAll(config.urls))
      )
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName.startsWith('jdit-cache-') && !Object.values(CACHE_CONFIG).some(config => config.name === cacheName))
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// Fetch event - implement cache-first strategy with network fallback
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }

      return fetch(event.request).then(response => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Determine which cache to use
        let cacheName = CACHE_CONFIG.STATIC.name;
        if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
          cacheName = CACHE_CONFIG.IMAGES.name;
        } else if (event.request.url.startsWith('https://')) {
          cacheName = CACHE_CONFIG.EXTERNAL.name;
        }

        // Cache the response
        caches.open(cacheName).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Handle offline fallback
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html');
      })
    );
  }
});
