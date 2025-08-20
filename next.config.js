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
