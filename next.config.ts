import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  } as NextConfig["eslint"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
