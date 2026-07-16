const CACHE_NAME = "tcb-ui-demo-v3";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./login.html",
    "./key.html",
    "./home.html",

    "./css/index.css",
    "./css/login.css",
    "./css/key.css",
    "./css/home.css",

    "./img/logotech.jpg",
    "./img/login.jpg"

    
];


/* CÀI ĐẶT SERVICE WORKER */
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(FILES_TO_CACHE);
            })
    );

    self.skipWaiting();
});


/* XÓA CACHE PHIÊN BẢN CŨ */
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

    self.clients.claim();
});


/* ĐỌC FILE TỪ CACHE */
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedFile) => {
                return cachedFile ||
                    fetch(event.request);
            })
    );
});