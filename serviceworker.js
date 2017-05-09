var CACHE = 'kittens-only';
self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed.');
  evt.waitUntil(precache().then(function() {
    console.log('[ServiceWorker] Skip waiting on install');
      return self.skipWaiting();

  })
  );
});

//allow sw to control of current page
self.addEventListener('activate', function(event) {
console.log('[ServiceWorker] Claiming clients for current page');
      return self.clients.claim();

});

function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll([
      'kitten.jpg'
    ]);
  });
}


self.addEventListener('fetch', function(evt) {
    if(evt.request.url.match('html')){
        evt.respondWith(fromServer(evt.request))
        return
    }
  console.log('The service worker is serving the asset.'+ evt.request.url);
  evt.respondWith(fromCache('kitten.jpg'));
  
});

function fromCache(request) {
  //we pull files from the cache first thing so we can show them fast
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}