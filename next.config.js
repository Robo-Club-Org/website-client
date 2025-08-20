/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["placeholder.svg"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  // Use standalone output for Heroku deployments
  output: 'standalone',
  // Skip dynamic routes during static export
  exportPathMap: async function() {
    return {
      '/': { page: '/' },
      '/products': { page: '/products' },
      '/categories': { page: '/categories' },
      '/brands': { page: '/brands' },
      '/used-products': { page: '/used-products' },
      '/contact-us': { page: '/contact-us' },
      '/help-center': { page: '/help-center' },
      '/shipping-info': { page: '/shipping-info' },
      '/returns': { page: '/returns' },
      '/login': { page: '/login' },
      '/register': { page: '/register' },
    };
  },
  // Set fallback for dynamic routes to true to generate on demand
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
  // Environment variables
  env: {
    BUILD_MODE: 'static',
    NEXT_PUBLIC_API_URL: process.env.API_URL || 'https://roboclub-server-70e29f041ab3.herokuapp.com',
  },
}

module.exports = nextConfig
