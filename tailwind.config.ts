import type { Config } from 'tailwindcss'
import { hyspPreset } from '@hysp/ui-kit/tailwind-preset'

const config: Config = {
  presets: [hyspPreset as Config],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@hysp/ui-kit/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
    },
  },
}

export default config
