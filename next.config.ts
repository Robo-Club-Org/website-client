import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow loading images from any HTTP(S) domain
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    // We’re not using the built-in Image Optimization pipeline
    unoptimized: true,
  },
};

export default nextConfig;
