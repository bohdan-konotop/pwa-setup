const CACHE_NAME = 'PWA_CACHE';
const urlsToCache = [
  '/',
  'main.css',
  'main.js',
  'https://freetestapi.com/api/v1/movies'
];

// The install event is triggered when the service worker is being
// installed for the first time. This event is a good time to cache
// important static assets, so they can be served offline later.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// The fetch event is triggered whenever a network request is 
// made (e.g., fetching an image, script, or a page). This event
// handler intercepts the request and can serve files from the
// cache if available.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      console.log(response)
      return response || fetch(event.request);
    })
  );
});
