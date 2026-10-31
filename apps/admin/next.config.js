import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(__dirname, '../..');
const r2ImageHostname =
  process.env.ADMIN_R2_ACCOUNT_ID && process.env.ADMIN_R2_BUCKET_NAME
    ? `${process.env.ADMIN_R2_BUCKET_NAME}.${process.env.ADMIN_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : null;

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingRoot: WORKSPACE_ROOT,
  turbopack: {
    root: WORKSPACE_ROOT,
  },
  experimental: {
    // Caps static-generation worker parallelism to keep peak memory down
    // during `next build` — the deploy VPS is memory-constrained and
    // multiple workers building concurrently has caused OOM kills. This
    // does NOT fix the /_global-error prerender crash (see --debug-prerender
    // in package.json's build script for that); it's purely a resource knob.
    cpus: 1,
  },
  transpilePackages: ['react-map-gl', 'mapbox-gl'],
  serverExternalPackages: ['geoip-lite'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.naufalrf.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      ...(r2ImageHostname
        ? [
            {
              protocol: 'https',
              hostname: r2ImageHostname,
              pathname: '/**',
            },
          ]
        : []),
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
