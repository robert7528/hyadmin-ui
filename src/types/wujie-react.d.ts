declare module 'wujie-react' {
  import { Component } from 'react'

  interface WujieReactProps {
    name: string
    url: string
    width?: string
    height?: string
    sync?: boolean
    alive?: boolean
    degrade?: boolean
    fiber?: boolean
    props?: Record<string, unknown>
    fetch?: typeof window.fetch
    plugins?: unknown[]
    beforeLoad?: () => void
    beforeMount?: () => void
    afterMount?: () => void
    beforeUnmount?: () => void
    afterUnmount?: () => void
    activated?: () => void
    deactivated?: () => void
  }

  export default class WujieReact extends Component<WujieReactProps> {
    static bus: {
      $on: (event: string, fn: (...args: unknown[]) => void) => void
      $off: (event: string, fn?: (...args: unknown[]) => void) => void
      $emit: (event: string, ...args: unknown[]) => void
    }
    static setupApp: (options: Partial<WujieReactProps> & { name: string }) => void
    static preloadApp: (options: { name: string; url: string }) => void
    static destroyApp: (name: string) => void
  }
}
