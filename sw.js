// کش آفلاین خرج‌یار: بار اول همه فایل‌ها ذخیره می‌شوند تا برنامه بدون اینترنت هم باز شود
const CACHE = 'kharjyar-202611011929';
const CORE = ['./', 'index.html', 'manifest.json', 'flutter.js', 'flutter_bootstrap.js', 'main.dart.js',
  'sqflite_sw.js', 'sqlite3.wasm', 'canvaskit/canvaskit.js', 'canvaskit/canvaskit.wasm', 'canvaskit/chromium/canvaskit.js', 'canvaskit/chromium/canvaskit.wasm', 'assets/fonts/fallback/Roboto-Regular.ttf',
  'assets/AssetManifest.bin', 'assets/AssetManifest.bin.json', 'assets/FontManifest.json',
  'assets/assets/fonts/Vazirmatn-Regular.ttf', 'assets/assets/fonts/Vazirmatn-Bold.ttf',
  'assets/fonts/MaterialIcons-Regular.otf', 'icons/apple-touch-icon.png', 'icons/Icon-192.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // صفحه اصلی: اول شبکه (برای گرفتن نسخه جدید)، در نبود اینترنت از کش
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((r) => { const c = r.clone(); caches.open(CACHE).then((x) => x.put('./', c)); return r; })
      .catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((r) => {
    if (r.ok) { const c = r.clone(); caches.open(CACHE).then((x) => x.put(req, c)); }
    return r;
  })));
});
