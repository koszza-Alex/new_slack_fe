import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   allowedDevOrigins: ['192.168.137.98'],
  /* config options here */
    webpack: (config) => {
    config.cache = false;
    return config;
  },
  
};

export default nextConfig;
