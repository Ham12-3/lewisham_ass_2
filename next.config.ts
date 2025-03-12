import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "startup-template-sage.vercel.app"],
    // Or you can use remotePatterns for more granular control
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'res.cloudinary.com',
    //     pathname: '/**',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'startup-template-sage.vercel.app',
    //     pathname: '/**',
    //   },
    // ],
  },
};

export default nextConfig;
