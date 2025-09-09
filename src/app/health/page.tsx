"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function HealthPage() {
  const [status, setStatus] = useState<string>("checking...");
  useEffect(() => {
    api.get("/healthz")
      .then((r) => setStatus(JSON.stringify(r.data, null, 2)))
      .catch((e) => setStatus(`ERROR: ${e?.message || "unknown"}`));
  }, []);
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Health Check</h1>
      <pre className="rounded border p-4 whitespace-pre-wrap break-words">{status}</pre>
    </main>
  );
}
