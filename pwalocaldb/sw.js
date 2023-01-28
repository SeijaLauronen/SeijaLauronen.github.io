var cacheName = 'hello-pwa';
var filesToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  'https://unpkg.com/localbase/dist/localbase.min.js'
];

/* Start the service worker and cache all of the app's content */
// kts https://www.youtube.com/watch?v=kT3qSf7jG5c&list=PL4cUxeGkcC9gTxqJBcDmoi5Q2pzDusSL7&index=15
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
// kts https://www.youtube.com/watch?v=0mAw9Na6hyM&list=PL4cUxeGkcC9gTxqJBcDmoi5Q2pzDusSL7&index=16
// hakee ensin cahesta ja jos ei löydy, niin sitten serveriltä
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
