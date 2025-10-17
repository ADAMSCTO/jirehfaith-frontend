import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const config: NextConfig = {
  reactStrictMode: true,

  async headers() {
    if (!isDev) return [];
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "connect-src 'self' http://127.0.0.1:8081 ws://localhost:3000 ws://127.0.0.1:3000",
              "frame-src https://*.stripe.com https://*.paypal.com https://*.paypalobjects.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self' https://checkout.stripe.com https://www.paypal.com",
            ].join("; "),
          },
          { key: "Referrer-Policy", value: "no-referrer-when-downgrade" },
        ],
      },
    ];
  },
};

export default config;
