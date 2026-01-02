/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      a: process.cwd() // enables imports like: a/lib/getBaseUrl
    };
    return config;
  }
};

export default nextConfig;
