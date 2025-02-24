/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode for better development experience
  reactStrictMode: true,

  // Configure async rewrites to proxy API requests in development
  async rewrites() {
    return process.env.NODE_ENV === 'development'
      ? [
          {
            source: '/api/:path*',
            destination: 'http://localhost:3001/api/:path*',
          },
        ]
      : []
  },

  // Disable x-powered-by header for security
  poweredByHeader: false,
}

module.exports = nextConfig
