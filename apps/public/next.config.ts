import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@naufalrf/ui', '@naufalrf/types', '@naufalrf/sdk'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-bddf3c7a03ef4238a49feac98d3cf217.r2.dev',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
