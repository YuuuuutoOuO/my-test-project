const CACHE_NAME = 'brainwallet-v1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'https://cdn.tailwindcss.com'
];

// 安裝時抓取檔案
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 沒網路時從快取抓取
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
