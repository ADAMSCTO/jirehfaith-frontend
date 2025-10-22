// === ServiceWorker.tsx — UNREGISTER + CACHE PURGE (no new registration) ===
"use client";

import { useEffect } from "react";

/**
 * This component *only* cleans up:
 *  - Unregisters any existing service workers
 *  - Deletes caches they may have created
 *  - Forces a hard refresh on first load after cleanup (optional)
 *
 * It does NOT register any new SW.
 */
export default function ServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    (async () => {
      try {
        // 1) Unregister all active SWs
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          try {
            await reg.unregister();
            // Try to nudge any waiting/active worker to stop as well
            reg.active?.postMessage?.({ type: "SW_UNREGISTERED" });
            reg.waiting?.postMessage?.({ type: "SW_UNREGISTERED" });
            reg.installing?.postMessage?.({ type: "SW_UNREGISTERED" });
          } catch (e) {
            console.warn("[SW] unregister failed:", e);
          }
        }

        // 2) Purge caches created by the SW (workbox, next, custom)
        if ("caches" in window) {
          try {
            const names = await caches.keys();
            for (const name of names) {
              // delete all caches; adjust if you want to keep some
              await caches.delete(name);
            }
          } catch (e) {
            console.warn("[SW] cache cleanup failed:", e);
          }
        }

        // 3) Optional: hard reload once per browser session after cleanup,
        //    to ensure fresh HTML/JS/CSS (prevents purple flash from stale shell)
        const FLAG = "__jf_sw_cleanup_done__";
        if (!sessionStorage.getItem(FLAG)) {
          sessionStorage.setItem(FLAG, "1");
          // Use location.replace to avoid creating a new history entry
          window.location.replace(window.location.href);
        }
      } catch (err) {
        console.warn("[SW] cleanup failed:", err);
      }
    })();
  }, []);

  return null;
}
// === END ServiceWorker.tsx ===
