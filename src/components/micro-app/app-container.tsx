import WujieReact from 'wujie-react'
import type { Module } from '@/types/module'

interface AppContainerProps {
  module: Module
  url?: string
}

export function AppContainer({ module, url }: AppContainerProps) {
  return (
    <WujieReact
      name={module.name}
      url={url || module.url}
      width="100%"
      height="100%"
    />
  )
}
