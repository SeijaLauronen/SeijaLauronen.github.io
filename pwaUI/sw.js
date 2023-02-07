const staticCacheName = 'pwaui-static-21';
const dynamicCacheName = 'pwaui-dynamic-21'; // tämäkin joutaisi pois, mutta jätetään toistaiseksi..
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
  console.log('service worker installed');
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


// lesson 17:Sta tämä, ilman dynamic cachea
// fetch event
self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});





/*
//https://www.youtube.com/watch?v=ChXgikdQJR8&list=PL4cUxeGkcC9gTxqJBcDmoi5Q2pzDusSL7&index=18
//responsea ei voi käyttää/ottaa kiinni useampaan kertaan, siksi otetaan siitä kopio cachetta varten!
// fetch event
// jostain syystä saitilla ei tule nyt ollenkaan static cahea, tulee vain dynamic...
self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  evt.respondWith(
    caches
    .match(evt.request)
    .then(cacheRes => {
      return cacheRes || 
        fetch(evt.request)
        .then(fetchRes => { //tähän tarjoisi asyncia
          return caches.open(dynamicCacheName).then(cache => {
            //Seija oma, ei laiteta cacheen, jos ei ollut ok!!
            //Jostain syystä tämä iffailu esti myös static cacheen laiton, niin ei näkynyt mm ikoneja
            // jos laittaskin deleten tuonne catchiin?
            //if (fetchRes.clone().status == 404) {                
                //return (caches.match('/pwaUI/pages/fallback.html'))
            //    return (caches.match('https://seijalauronen.github.io/pwaUI/pages/fallback.html'))
            //} else {
                cache.put(evt.request.url, fetchRes.clone()); //alkuperänen rivi
                return fetchRes;  //alkuperänen rivi
            //}
          })
        });
    //}).catch(() => caches.match('/pwaUI/pages/fallback.html')) //https://seijalauronen.github.io/pwaUI/pages/fallback.html
  }).catch(() => caches.match('https://seijalauronen.github.io/pwaUI/pages/fallback.html')) 
  );
  });
*/




