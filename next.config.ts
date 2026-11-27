import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const PROD_API_HOSTNAME = process.env.NEXT_PUBLIC_API_HOSTNAME || "api.pakelagi.com";
const BACKEND_ORIGIN = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1"
)
  .replace(/\/api\/v1\/?$/, "")
  .replace(/\/+$/, "");

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    dangerouslyAllowLocalIP: isDev, // true saat dev, otomatis false saat production
    remotePatterns: isDev
      ? [
          { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/storage/**" },
          { protocol: "http", hostname: "localhost", port: "8000", pathname: "/storage/**" },
          { protocol: "https", hostname: "res.cloudinary.com" },
          { protocol: "https", hostname: "images.unsplash.com" },
        ]
      : [
          { protocol: "https", hostname: PROD_API_HOSTNAME, pathname: "/storage/**" },
          { protocol: "https", hostname: "res.cloudinary.com" },
          { protocol: "https", hostname: "images.unsplash.com" },
        ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_ORIGIN}/api/v1/:path*`,
      },
      {
        source: "/sanctum/:path*",
        destination: `${BACKEND_ORIGIN}/sanctum/:path*`,
      },
    ];
  },
};

export default nextConfig;
