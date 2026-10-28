/* MandarinPath service worker
 * - Navigations: network-first, fall back to cached page, then offline shell.
 * - Static assets (/_next/static, icons, vocab JSON): stale-while-revalidate.
 * - Hanzi stroke data from jsDelivr: cache-first (immutable per character).
 * Bump CACHE_VERSION whenever caching logic changes.
 */
const CACHE_VERSION = 'mp-v2';
const PAGE_CACHE = `${CACHE_VERSION}-pages`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const STROKE_CACHE = `${CACHE_VERSION}-strokes`;

const PRECACHE_PAGES = ['/', '/vocabulary', '/writing', '/tones', '/curriculum', '/listening', '/grammar', '/quiz', '/analytics', '/diagnostic'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PAGE_CACHE)
      .then((cache) => Promise.allSettled(PRECACHE_PAGES.map((p) => cache.add(p))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Stroke data (hanzi-writer-data on jsDelivr)
  if (url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('hanzi-writer-data')) {
    event.respondWith(
      caches.open(STROKE_CACHE).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      })
    );
    return;
  }

  if (url.origin !== self.location.origin) return;
  // Never cache Supabase/auth or API calls
  if (url.pathname.startsWith('/api/')) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGE_CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match('/')) || Response.error())
    );
    return;
  }

  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/data/') || url.pathname.startsWith('/icon')) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const hit = await cache.match(req);
        const network = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => hit);
        return hit || network;
      })
    );
  }
});
