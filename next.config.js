/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // replaces `next export`
  images: { unoptimized: true } // safe for static export; we use local assets
};

module.exports = nextConfig;
