// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Providers from "./providers";
import Header from "@/components/Header";
import ServiceWorker from "@/components/ServiceWorker";
import ScrollToTop from "./ScrollToTop";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "JirehFaith",
  description: "Prayer Composer with The Holy Bible Scriptures",
};

// NOTE: For production hosting behind a server/proxy (e.g., nginx),
// enforce CSP via response headers (plus HSTS). We intentionally
// avoid <meta httpEquiv="Content-Security-Policy"> in static export.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Export-friendly security metas */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="no-referrer-when-downgrade" />

        {/* PWA / icons */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/open-bible-gold.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="theme-color" content="#000000" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <ServiceWorker />
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        <Providers>
          <div className="pt-4 md:pt-6">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
