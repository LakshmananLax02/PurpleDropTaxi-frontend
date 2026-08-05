"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return undefined;

    navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    }).catch(() => {
      // Service workers are progressive enhancement; booking remains available
      // in browsers or private contexts that block them.
    });

    return undefined;
  }, []);

  return null;
}
