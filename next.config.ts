import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    staleTimes: {
      dynamic: 300,
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "nroqxdkhpdskelhzcaob.supabase.co" },
    ],
  },
};

export default nextConfig;