/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@naufalrf/ui', '@naufalrf/types', '@naufalrf/sdk', '@naufalrf/config'],
};

export default nextConfig;
