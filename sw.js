// Service Worker for PWA functionality
const CACHE_NAME = 'dragos-portfolio-v3'; // Bumped cache version again due to updates
const urlsToCache = [
    '/',
    '/index.html',
    '/projects.html',
    '/blog.html',
    '/privacy-policy.html',
    '/style.css',
    '/script.js',
    '/assets/CR__9822.jpg',
    '/assets/icons/cybersecurity-icons.png',
    '/assets/favicon.ico', // Inclus chiar dacă este gol, ar trebui înlocuit cu un fișier valid
    '/assets/apple-touch-icon.png',
    '/assets/hexagon-pattern.jpg',
    '/assets/cybersecurity-shield-background.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
