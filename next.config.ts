import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vignette.wikia.nocookie.net",
      },
    ],
  },
};

export default nextConfig;
