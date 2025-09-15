"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-10 bg-[var(--header)] backdrop-blur border-b border-black/10">
      <div className="mx-auto max-w-5xl px-4 py-1 flex items-center justify-between flex-wrap gap-2">
        {/* Center title / logo block */}
        <Link
          href="/"
          aria-label="Go to Home"
          title="Home"
          className="flex flex-col items-center text-center flex-grow leading-tight w-full order-2 md:order-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] cursor-pointer"
        >
          <div className="text-3xl" style={{ color: "var(--brand-gold)" }}>
            🔥
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--brand-gold)" }}>
            JIREH FAITH
          </div>
          <div className="text-base italic" style={{ color: "var(--brand-gold)" }}>
            When life speaks, let God’s Word answer.
          </div>
        </Link>

        {/* Nav buttons — centered under logo */}
        <nav className="flex items-center gap-3 text-sm flex-wrap order-3 md:order-none justify-center w-full">
          {/* HOME (🔥 before label) */}
          <Link
            href="/"
            aria-label="Home"
            className="px-3 py-1 rounded-md border text-black hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: "var(--brand-gold)" }}
          >
            🔥 Home
          </Link>

                   {/* DONATE */}
          <Link
            href="/donate"
            aria-label="Donate"
            className="px-3 py-1 rounded-md border text-black hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: "var(--brand-gold)" }}
          >
            ❤️ Donate
          </Link>

          {/* ABOUT (✝️ before label) */}
          <Link
            href="/about"
            aria-label="About"
            className="px-3 py-1 rounded-md border text-black hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: "var(--brand-gold)" }}
          >
            ✝️ About
          </Link>
        </nav>
      </div>
    </header>
  );
}
