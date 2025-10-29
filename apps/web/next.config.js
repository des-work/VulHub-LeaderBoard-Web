/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone', // Disabled due to Windows symlink issues
  transpilePackages: ['@vulhub/ui', '@vulhub/schema', '@vulhub/utils'],
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  },
}

module.exports = nextConfig
