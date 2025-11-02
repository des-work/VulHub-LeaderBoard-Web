/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone', // Disabled due to Windows symlink issues
  // transpilePackages: ['@vulhub/ui', '@vulhub/schema', '@vulhub/utils'],
  typescript: {
    // Temporarily ignore type errors during build for faster development
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: process.env.NEXT_PUBLIC_IMAGE_DOMAINS 
      ? process.env.NEXT_PUBLIC_IMAGE_DOMAINS.split(',')
      : [],
  },
}

module.exports = nextConfig
