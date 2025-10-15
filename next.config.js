/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export config (current app behavior)
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },

  async headers() {
    // Tight Content Security Policy suitable for static export
    // If you later load assets from a CDN, add it to the src lists below.
    const csp = [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self'",
      "img-src 'self' data:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests"
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          // Content Security Policy
          { key: "Content-Security-Policy", value: csp },

          // MIME sniffing protection
          { key: "X-Content-Type-Options", value: "nosniff" },

          // Clickjacking protection
          { key: "X-Frame-Options", value: "DENY" },

          // Referrer policy (tighten later if desired)
          { key: "Referrer-Policy", value: "no-referrer-when-downgrade" },

          // Restrict powerful browser features (adjust if you need any of these)
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
              "xr-spatial-tracking=()"
            ].join(", ")
          },

          // HSTS: safe when site is always served over HTTPS (recommended for prod)
          { key: "Strict-Transport-Security", value: "max-age=15552000; includeSubDomains" }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
