'use client'

import { useEffect, useState } from 'react'
import type { Module } from '@/types/module'

interface AppContainerProps {
  module: Module
}

export function AppContainer({ module }: AppContainerProps) {
  const [height, setHeight] = useState(800)

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'HYSP_RESIZE' && e.data?.height) {
        setHeight(e.data.height)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <iframe
      src={module.url}
      title={module.display_name}
      className="w-full border-0"
      style={{ height: `${height}px` }}
    />
  )
}
