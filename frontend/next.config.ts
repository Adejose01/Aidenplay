import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Permitir imágenes externas de PocketBase y Unsplash
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8090",
        pathname: "/api/files/**",
      },
      {
        protocol: "http",
        hostname: "backend",
        port: "8090",
        pathname: "/api/files/**",
      },
      {
        protocol: "https",
        hostname: "aidenplay.com",
        pathname: "/api/files/**",
      },
      {
        protocol: "https",
        hostname: "db.aidenplay.com",
        pathname: "/api/files/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/proxy/api/:path*",
        destination: "http://backend:8090/api/:path*", // Proxy al backend interno
      },
      {
        source: "/proxy/_/:path*",
        destination: "http://backend:8090/_/:path*", // Proxy al admin de PB
      }
    ];
  },
};

export default nextConfig;
