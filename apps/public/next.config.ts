import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@naufalrf/ui', '@naufalrf/types', '@naufalrf/sdk'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
