/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // Allow vaani.ai dashboard to embed this site in an iframe for the CMS editor
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'ALLOWALL' },
        { key: 'Content-Security-Policy', value: "frame-ancestors *" },
      ],
    }];
  },
};
module.exports = nextConfig;
