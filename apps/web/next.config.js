/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@vulhub/ui', '@vulhub/schema', '@vulhub/utils'],
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  },
}

module.exports = nextConfig
