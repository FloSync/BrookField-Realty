import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "brookfieldrealtorltd.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/investments",
        destination: "/properties",
        permanent: true,
      },
      {
        source: "/investment",
        destination: "/properties",
        permanent: true,
      },
      {
        source: "/properties/beverly-hills",
        destination: "/properties/beverly-homes",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

// Wrangler env for local `next dev` (loads wrangler.jsonc env.staging bindings).
// Override via NEXT_DEV_WRANGLER_ENV in .env.local if needed (OpenNext reads it when
// `environment` is omitted; explicit `environment` here takes precedence).
import("@opennextjs/cloudflare").then((m) =>
  m.initOpenNextCloudflareForDev({ environment: "staging" }),
);
