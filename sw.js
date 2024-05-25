// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-8-starter';

// Installs the service worker. Feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // B6. TODO - Add all of the URLs from RECIPE_URLs here so that they are
      //            added to the cache when the ServiceWorker is installed
      //create a array of the recipes we originally had, in the var RECIPE_URLS
      const RECIPE_URLS = [
        'https://adarsh249.github.io/Lab8-Starter/recipes/1_chocolate-chip-cookies.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/2_chocolate-cake.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/3_chocolate-souffle.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/4_chocolate-brownies.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/5_chocolate-pudding.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json'
      ];

      self.addEventListener('install', function (event) {
        //does not terminate until the prtomise is fullfilled 
        event.waitUntil(
          caches.open(CACHE_NAME).then(function (cache) {
            //replaces/load up the empty array with the recipes 
            return cache.addAll(RECIPE_URLS);
          })
        );
      });
      return cache.addAll([]);
    })
  );
});

// Activates the service worker
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Intercept fetch requests and cache them
self.addEventListener('fetch', function (event) {
  // We added some known URLs to the cache above, but tracking down every
  // subsequent network request URL and adding it manually would be very taxing.
  // We will be adding all of the resources not specified in the intiial cache
  // list to the cache as they come in.
  /*******************************/
  // This article from Google will help with this portion. Before asking ANY
  // questions about this section, read this article.
  // NOTE: In the article's code REPLACE fetch(event.request.url) with
  //       fetch(event.request)
  // https://developer.chrome.com/docs/workbox/caching-strategies-overview/
  /*******************************/
  // B7. TODO - Respond to the event by opening the cache using the name we gave
  //            above (CACHE_NAME)
  // B8. TODO - If the request is in the cache, return with the cached version.
  //            Otherwise fetch the resource, add it to the cache, and return
  //            network response.
  // B7
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        // B8
        if (response) {
          return response;
        }
        //fetch the response and add it to the cache
        return fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});