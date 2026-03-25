// 每次修改了 js/ 或 lib/ 裡面的檔案，記得把這個版本號加一 (例如改成 v13)
const CACHE_NAME = 'brainwallet-v13'; 

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './js/app.js',                 // 新的自訂邏輯路徑
  './lib/crypto-js.min.js',      // 新的外部庫路徑
  './lib/ripemd160.min.js',      // 新的外部庫路徑
  './lib/elliptic.min.js',       // 新的外部庫路徑
  'https://cdn.tailwindcss.com'
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
