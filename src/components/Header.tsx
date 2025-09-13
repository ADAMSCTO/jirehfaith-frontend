"use client";

import Link from "next/link";
import Image from "next/image";

const SITE_NAME = process.env.NEXT_PUBLIC_APP_NAME || "JirehFaith";
const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL || "#";

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

        {/* Left/Right nav */}
        <nav className="flex items-center gap-3 text-sm flex-wrap order-3 md:order-none justify-center w-full md:w-auto">
          {/* HOME (left) — praying hands icon */}
          <Link
            href="/"
            aria-label="Home"
            className="px-3 py-1 rounded-md border text-black hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: "var(--brand-gold)" }}
          >
            <Image
              src="/icons/praying-hands-gold.png"
              alt="Home"
              width={20}
              height={20}
              priority
            />
            Home
          </Link>

          {/* DONATE (middle) */}
          <a
            href={DONATE_URL}
            aria-label="Donate"
            className="px-3 py-1 rounded-md border text-black hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: "var(--brand-gold)" }}
            target="_blank"
            rel="noreferrer"
          >
            ❤️ Donate
          </a>

          {/* ABOUT (right) — ✝️ + open bible icon */}
          <Link
            href="/about"
            aria-label="About"
            className="px-3 py-1 rounded-md border text-black hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: "var(--brand-gold)" }}
          >
            ✝️
            <Image
              src="/icons/open-bible-gold.png"
              alt="About"
              width={20}
              height={20}
              priority
            />
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

