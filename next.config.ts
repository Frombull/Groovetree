import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Desabilita otimização automática para manter qualidade original
  },
};

export default nextConfig;
