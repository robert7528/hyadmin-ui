import type { DetailedHTMLProps, HTMLAttributes } from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'micro-app': DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          name?: string
          url?: string
          baseroute?: string
          iframe?: boolean
          inline?: boolean
          disableSandbox?: boolean
          destroy?: boolean
        },
        HTMLElement
      >
    }
  }
}
