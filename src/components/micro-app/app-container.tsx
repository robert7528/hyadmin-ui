'use client'

import dynamic from 'next/dynamic'

const WujieReact = dynamic(() => import('wujie-react'), { ssr: false })
import type { Module } from '@/types/module'

interface AppContainerProps {
  module: Module
}

export function AppContainer({ module }: AppContainerProps) {
  return (
    <WujieReact
      name={module.name}
      url={module.url}
      sync={true}

      width="100%"
      height="100%"
    />
  )
}
