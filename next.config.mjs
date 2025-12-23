/** @type {import('next').NextConfig} */
const nextConfig = {
  // render-friendly (reduces cold starts on Free too)
  output: 'standalone',
  experimental: {} // ← do not put appDir here; it's removed in Next 14
};

export default nextConfig;
