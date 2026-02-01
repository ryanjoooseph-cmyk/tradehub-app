// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Matches `next build --debug-prerender` behavior:
    // - disables server minification
    // - disables turbopack minify
    // - enables server source maps
    // - prevents early-exit on first prerender error
    serverMinification: false,
    turbopackMinify: false,
    serverSourceMaps: true,
    prerenderEarlyExit: false,
  },

  // Enables source map consumption in prerender worker processes
  enablePrerenderSourceMaps: true,
}

module.exports = nextConfig
