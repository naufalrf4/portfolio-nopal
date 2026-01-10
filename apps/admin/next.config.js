/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@naufalrf/ui',
    '@naufalrf/types',
    '@naufalrf/sdk',
    '@naufalrf/auth',
    '@naufalrf/config',
  ],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;
