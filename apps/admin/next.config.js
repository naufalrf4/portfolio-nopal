/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@prisma/client', 'react-map-gl', 'mapbox-gl'],
  serverExternalPackages: ['geoip-lite'],
};

export default nextConfig;
