import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typescript: {
    // Ignore TypeScript errors during production builds
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during production builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;