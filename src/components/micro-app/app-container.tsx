'use client'

import { useEffect, useRef, useState } from 'react'
import type { Module } from '@/types/module'

interface AppContainerProps {
  module: Module
}

export function AppContainer({ module }: AppContainerProps) {
  const initialized = useRef(false)
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    import('@micro-zoe/micro-app').then(({ default: microApp }) => {
      if (!microApp.hasInit) {
        microApp.start()
      }
    })
  }, [])

  // Listen for height sync messages from child apps
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'HYSP_RESIZE' && e.data?.appName === module.name) {
        setHeight(e.data.height)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [module.name])

  return (
    <div
      className="w-full"
      style={height ? { height: `${height}px`, overflow: 'hidden' } : { minHeight: '100%' }}
    >
      <micro-app
        name={module.name}
        url={module.url}
        baseroute={`/app/${module.route}`}
        iframe
      />
    </div>
  )
}
