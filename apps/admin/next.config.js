import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(__dirname, '../..');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingRoot: WORKSPACE_ROOT,
  turbopack: {
    root: WORKSPACE_ROOT,
  },
  transpilePackages: ['react-map-gl', 'mapbox-gl'],
  serverExternalPackages: ['geoip-lite'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.naufalrf.tech',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
