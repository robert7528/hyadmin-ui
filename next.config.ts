import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@heroui/react', 'framer-motion'],
}

export default nextConfig
