"use client";

import Link from "next/link";
export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-2xl font-bold mb-4">You are offline</h1>
      <p className="mb-6">
        It looks like you’ve lost your connection. Don’t worry — you can still
        revisit saved prayers, and when you’re back online, full features will
        return.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700"
      >
        Back to Home
</Link>
    </div>
  );
}
