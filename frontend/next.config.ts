import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  cacheComponents: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URI}/api/v1/:path*`,
      }
    ]
  }
}

export default nextConfig
