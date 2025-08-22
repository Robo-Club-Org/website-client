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
  // This helps with dynamic server components
  output: process.env.NEXT_PHASE === 'build' ? 'standalone' : 'standalone',
  experimental: {
    // This allows dynamic usage in routes that would typically
    // need to be statically generated at build time
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
  // Mark API routes as dynamic to prevent static generation errors
  env: {
    BUILD_MODE: process.env.NEXT_PHASE === 'build' ? 'static' : 'dynamic',
    NEXT_PUBLIC_API_URL: process.env.API_URL || 'https://roboclub-server-70e29f041ab3.herokuapp.com',
  },
}

module.exports = nextConfig
