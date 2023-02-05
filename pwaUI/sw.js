const staticCacheName = 'pwaui-static-8';
const dynamicCacheName = 'pwaui-dynamic-8';
// nämä on kutsuja, siksi tuo / on se yksi kutsu... ei siis taida viitata hakemistoon?!
// Add napista tuli offline tilassa page not fount, siinä urlissa oli perässä kyssäri, niin laitoin myös sen tähän.
// myös kun laittoi dunaamisen cahen, niin jos oli käynyt painamassa online tilassa Addnappi, niin se toimi
const assets = [
  '/',
  'index.html',
  'index.html?',
  'js/main.js',
  'js/ui.js',
  'js/materialize.min.js',
  'css/styles.css',
  'css/materialize.min.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  'pages/fallback.html'
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
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

//https://www.youtube.com/watch?v=ChXgikdQJR8&list=PL4cUxeGkcC9gTxqJBcDmoi5Q2pzDusSL7&index=18
//responsea ei voi käyttää/ottaa kiinni useampaan kertaan, siksi otetaan siitä kopio cachetta varten!
// fetch event
self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  evt.respondWith(
    caches
    .match(evt.request)
    .then(cacheRes => {
      return cacheRes || 
        fetch(evt.request)
        .then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            //Seija oma, ei laiteta cacheen, jos ei ollut ok!!
            //if (!fetchRes.clone().ok) {                
            //    return (caches.match('/pages/fallback.html'))
            //} else {
                cache.put(evt.request.url, fetchRes.clone());
                return fetchRes;
            //}
          })
        });
    }).catch(() => caches.match('/pages/fallback.html'))
  );
});
