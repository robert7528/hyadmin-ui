'use client'

import { HeroUIProvider } from '@heroui/react'
import { ModuleProvider } from '@/contexts/module-context'
import { PermissionProvider } from '@/contexts/permission-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <PermissionProvider>
        <ModuleProvider>{children}</ModuleProvider>
      </PermissionProvider>
    </HeroUIProvider>
  )
}
