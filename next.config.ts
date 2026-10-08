import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const PROD_API_HOSTNAME = process.env.NEXT_PUBLIC_API_HOSTNAME || "api.pakelagi.com";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    dangerouslyAllowLocalIP: isDev, // true saat dev, otomatis false saat production
    remotePatterns: isDev
      ? [
          { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/storage/**" },
          { protocol: "http", hostname: "localhost", port: "8000", pathname: "/storage/**" },
          { protocol: "https", hostname: "images.unsplash.com" },
        ]
      : [
          { protocol: "https", hostname: PROD_API_HOSTNAME, pathname: "/storage/**" },
          { protocol: "https", hostname: "images.unsplash.com" },
        ],
  },
};

export default nextConfig;