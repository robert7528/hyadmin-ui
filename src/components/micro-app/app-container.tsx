'use client'

import { useEffect, useRef } from 'react'
import type { Module } from '@/types/module'

// Declare micro-app custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'micro-app': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          name?: string
          url?: string
          baseroute?: string
        },
        HTMLElement
      >
    }
  }
}

interface AppContainerProps {
  module: Module
}

export function AppContainer({ module }: AppContainerProps) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    import('@micro-zoe/micro-app').then(({ default: microApp }) => {
      if (!microApp.hasInit) {
        microApp.start()
      }
    })
  }, [])

  return (
    <div className="h-full w-full">
      <micro-app
        name={module.name}
        url={module.url}
        baseroute={`/app/${module.route}`}
      />
    </div>
  )
}
