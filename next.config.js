/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/config',
        destination: '/api/config'
      },
      {
        source: '/api/game/:path*',
        destination: '/api/game/:path*'
      }
    ]

  }
}

module.exports = nextConfig
