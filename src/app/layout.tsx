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

// Export-friendly CSP as a <meta httpEquiv="Content-Security-Policy">
// NOTE: For production hosting behind a server/proxy (e.g., nginx), also set these as response headers (plus HSTS).
function csp(): string {
  const directives = [
    "default-src 'self'",
    // Next/Wallet SDKs (no 'unsafe-eval'); allow Stripe & PayPal SDKs and Google Pay if enabled later
    "script-src 'self' https://js.stripe.com https://www.paypal.com https://www.gstatic.com https://pay.google.com",
    // Tailwind/Next inline styles (can be tightened with nonces/hashes later)
    "style-src 'self' 'unsafe-inline'",
    // Images (allow data URIs for inline icons)
    "img-src 'self' data: https://*.stripe.com https://*.paypal.com",
    // XHR/fetch to local API (dev) + payment providers
    "connect-src 'self' http://127.0.0.1:8000 https://api.stripe.com https://*.stripe.com https://www.paypal.com https://*.paypal.com https://pay.google.com https://www.gstatic.com",
    // Frames (Stripe Checkout, PayPal, Wallets)
    "frame-src 'self' https://js.stripe.com https://m.stripe.network https://checkout.stripe.com https://www.paypal.com https://*.paypal.com https://pay.google.com",
    // Fonts (self + data)
    "font-src 'self' data:",
    // Mitigations
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://checkout.stripe.com https://www.paypal.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ];
  return directives.join("; ");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contentSecurityPolicy = csp();

  return (
    <html lang="en">
      <head>
        {/* Export-friendly security metas */}
        <meta httpEquiv="Content-Security-Policy" content={contentSecurityPolicy} />
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
