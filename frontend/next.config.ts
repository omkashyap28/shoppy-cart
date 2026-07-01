import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  async rewrites() {
    return [
      {
      source: "/backend/:path*",
        destination: `${process.env.BACKEND_URI}/api/v1/:path*`,
      },
    ];
  },
  allowedDevOrigins: ["10.86.101.120"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
    ],
  },
};

export default nextConfig;
