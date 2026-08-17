const CACHE_NAME = 'google-news-pwa-v1';
const RUNTIME_CACHE = 'google-news-runtime-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json'
];

self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching static assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET') {
        return;
    }

    if (!url.protocol.startsWith('http')) {
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(
            caches.match(request)
                .then(response => response || fetch(request))
                .then(response => {
                    if (response && response.status === 200) {
                        const cache = caches.open(RUNTIME_CACHE);
                        cache.then(c => c.put(request, response.clone()));
                    }
                    return response;
                })
                .catch(() => caches.match('/index.html'))
        );
        return;
    }

    if (isStaticAsset(url.pathname)) {
        event.respondWith(
            caches.match(request)
                .then(response => response || fetch(request))
                .then(response => {
                    if (response && response.status === 200) {
                        const cache = caches.open(CACHE_NAME);
                        cache.then(c => c.put(request, response.clone()));
                    }
                    return response;
                })
        );
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(response => response || fetch(request))
            .catch(() => createOfflineResponse())
    );
});

function isStaticAsset(pathname) {
    return /\.(js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/i.test(pathname) ||
           pathname === '/' ||
           pathname === '/index.html' ||
           pathname === '/manifest.json';
}

function createOfflineResponse() {
    return new Response(
        JSON.stringify({
            articles: [
                {
                    title: '📴 Modalità Offline',
                    description: 'Nessuna connessione disponibile.',
                    source: 'Cache',
                    date: new Date().toISOString()
                }
            ]
        }),
        {
            status: 200,
            statusText: 'OK',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}