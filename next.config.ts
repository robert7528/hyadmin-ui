import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  basePath: '/hyadmin',
  transpilePackages: ['@heroui/react', 'framer-motion'],
}

export default nextConfig
