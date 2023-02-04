const staticCacheName = 'pwaui-static-3';
// nämä on kutsuja, siksi tuo / on se yksi kutsu... ei siis taida viitata hakemsitoon?!
const assets = [
  '/',
  'index.html',
  'js/main.js',
  'js/ui.js',
  'js/materialize.min.js',
  'css/styles.css',
  'css/materialize.min.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
];




// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  // install voi kestää liian vähän aikaa, että chaetus kerkeäisi tapahtua, siksi odotetaan cachetus
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});


// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});