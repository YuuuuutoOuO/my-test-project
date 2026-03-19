const CACHE_NAME = 'brainwallet-v11'; // 升級版本號強制更新
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './crypto-js.min.js',
  './ripemd160.min.js',
  './elliptic.min.js',
  'https://cdn.tailwindcss.com' // UI 樣式庫
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
