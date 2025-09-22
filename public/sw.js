// public/sw.js
// JirehFaith PWA Service Worker — RC10 Phase 2
const CACHE_NAME = "jf-pwa-v2";
const OFFLINE_URL = "/offline";

// A tiny allowlist of same-origin runtime caches
const RUNTIME_CACHE_PATHS = [
  "/",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/open-bible-gold.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      await cache.addAll(RUNTIME_CACHE_PATHS);
      // Try to warm the offline page if it exists (won’t fail install if missing)
      await cache.add(new Request(OFFLINE_URL, { cache: "reload" })).catch(() => {});
    } catch (_) {
      // Ignore individual add failures; SW should still install
    }
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    // Remove old caches
    const names = await caches.keys();
    await Promise.all(
      names.map((n) => (n !== CACHE_NAME ? caches.delete(n) : Promise.resolve()))
    );
    await self.clients.claim();
  })());
});

// Strategy:
// • Navigations: network-first, fall back to /offline if offline/error
// • Static assets (_next/static, images, icons): stale-while-revalidate
// • Everything else same-origin GET: cache-first, fall back to network
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET and same-origin
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  // Handle navigations (HTML documents)
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        // Optionally cache successful navigations
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, fresh.clone()).catch(() => {});
        return fresh;
      } catch {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(OFFLINE_URL)) || new Response("You are offline.", { status: 503 });
      }
    })());
    return;
  }

  const url = new URL(request.url);
  // Always resolve the favicon; if missing, fall back to open-bible icon
  if (url.pathname === "/favicon.ico") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const res = await fetch(request);
        if (res && res.ok) {
          cache.put(request, res.clone()).catch(() => {});
          return res;
        }
      } catch {}
      // Fallback to open-bible icon
      const fallbackReq = new Request("/open-bible-gold.png", { cache: "reload" });
      const fallbackRes = await fetch(fallbackReq).catch(() => null);
      if (fallbackRes && fallbackRes.ok) {
        cache.put(request, fallbackRes.clone()).catch(() => {});
        return fallbackRes;
      }
      return Response.error();
    })());
    return;
  }

  // Stale-while-revalidate for Next static chunks and images/icons
  const isStatic =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".ico");

  if (isStatic) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      const networkPromise = fetch(request).then((res) => {
        if (res && res.ok) cache.put(request, res.clone()).catch(() => {});
        return res;
      }).catch(() => null);
      return cached || (await networkPromise) || Response.error();
    })());
    return;
  }

  // Default: cache-first for same-origin GET
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const res = await fetch(request);
      if (res && res.ok) cache.put(request, res.clone()).catch(() => {});
      return res;
    } catch {
      return cached || Response.error();
    }
  })());
});
