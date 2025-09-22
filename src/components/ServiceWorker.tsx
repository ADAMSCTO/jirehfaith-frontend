"use client";

import { useEffect } from "react";

export default function ServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    // Only register in production builds
    if (process.env.NODE_ENV !== "production") return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js?v=2", { scope: "/" });
        await reg.update();
        console.log("[SW] registered v2", reg.scope);
        // Optional: listen for updates
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          // A new SW has taken control — could toast "updated" if desired
        });
      } catch (err) {
        // swallow registration errors
        console.error("SW register failed", err);
      }
    };

    register();
  }, []);

  return null;
}
