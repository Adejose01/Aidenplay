import type { NextConfig } from "next";

const PB_INTERNAL_URL = process.env.PB_INTERNAL_URL || "http://backend:8090";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: http://localhost:8090 http://backend:8090 https://aidenplay.com https://db.aidenplay.com https://images.unsplash.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' http://localhost:8090 http://backend:8090 https://aidenplay.com https://db.aidenplay.com https://wa.me https://ip-api.com;
    upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/proxy/api/:path*",
        destination: `${PB_INTERNAL_URL}/api/:path*`,
      },
      {
        source: "/proxy/_/:path*",
        destination: `${PB_INTERNAL_URL}/_/:path*`,
      }
    ];
  },
};

export default nextConfig;
