import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["horn-advertising-playback-stanford.trycloudflare.com"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
}

export default nextConfig
