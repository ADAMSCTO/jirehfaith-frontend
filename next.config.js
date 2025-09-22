/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export
  output: "export",

  // Disable Next.js image optimization since we serve local assets
  images: {
    unoptimized: true,
  },

  // Ensure /route -> /route/index.html (better for static + Capacitor)
  trailingSlash: true,
};

module.exports = nextConfig;
