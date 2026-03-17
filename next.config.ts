import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  basePath: '/hyadmin',
  transpilePackages: ['@hysp/ui-kit'],
}

export default nextConfig
