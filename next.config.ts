import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:59427', '127.0.0.1:*'],
    },
  },
};

export default nextConfig;
