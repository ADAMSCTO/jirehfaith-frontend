"use client";

import Link from "next/link";
import Image from "next/image";

const SITE_NAME = process.env.NEXT_PUBLIC_APP_NAME || "JirehFaith";
const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL || "#";
const SUBSCRIBE_URL = process.env.NEXT_PUBLIC_SUBSCRIBE_URL || "#";

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-10 bg-[var(--header)] backdrop-blur border-b border-black/10">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-transparent.png?v=gold1" alt={SITE_NAME} width={160} height={42} priority />
          <span className="sr-only">{SITE_NAME}</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/about" className="hover:underline">About</Link>
          <a
            href={DONATE_URL}
            className="px-3 py-1 rounded-md border text-black hover:opacity-90"
            style={{ backgroundColor: "var(--brand-gold)" }}
            target="_blank"
            rel="noreferrer"
          >
            ❤️ Donate
          </a>
          <a
            href={SUBSCRIBE_URL}
            className="px-3 py-1 rounded-md border text-black hover:opacity-90"
            style={{ backgroundColor: "var(--brand-gold)" }}
            target="_blank"
            rel="noreferrer"
          >
            ❤️ Subscribe
          </a>
        </nav>
      </div>
    </header>
  );
}
