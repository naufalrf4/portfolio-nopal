/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@prisma/client'],
  serverExternalPackages: ['geoip-lite'],
};

export default nextConfig;
