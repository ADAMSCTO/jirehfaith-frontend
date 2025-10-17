/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export config (current app behavior)
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },

  async headers() {
    // DEV-friendly CSP so Next.js dev + local API + PayPal/Stripe work.
    // In production, tighten these again (remove 'unsafe-*', restrict connect-src, etc).
    const isDev = process.env.NODE_ENV !== "production";

    const csp = [
      "default-src 'self'",
      // Allow eval/inline ONLY in dev to satisfy Next dev/runtime
      `script-src 'self' https://www.paypal.com https://www.paypalobjects.com${isDev ? " 'unsafe-eval' 'unsafe-inline'" : ""}`,
      // Allow inline styles in dev; prefer class names in prod
      `style-src 'self'${isDev ? " 'unsafe-inline'" : ""}`,
      // Images/fonts
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      // XHR/fetch/websocket targets
      `connect-src 'self' http://127.0.0.1:8081 https://*.paypal.com https://*.paypalobjects.com${isDev ? " ws://localhost:3000 ws://127.0.0.1:3000" : ""}`,
      // Embeds/frames for Stripe Checkout and PayPal buttons
      "frame-src https://*.stripe.com https://*.paypal.com https://*.paypalobjects.com https://*.venmo.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      // Allow posting to Stripe/PayPal
      "form-action 'self' https://checkout.stripe.com https://www.paypal.com",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer-when-downgrade" },
          {
            key: "Permissions-Policy",
            value: [
              "accelerometer=()",
              "ambient-light-sensor=()",
              "autoplay=()",
              "camera=()",
              "encrypted-media=()",
              "fullscreen=(self)",
              "geolocation=()",
              "gyroscope=()",
              "magnetometer=()",
              "microphone=()",
              "midi=()",
              "payment=()",
              "picture-in-picture=(self)",
              "usb=()",
              "xr-spatial-tracking=()",
            ].join(", "),
          },
          { key: "Strict-Transport-Security", value: "max-age=15552000; includeSubDomains" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
