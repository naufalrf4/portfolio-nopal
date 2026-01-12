import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@naufalrf/ui', '@naufalrf/types', '@naufalrf/sdk'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
