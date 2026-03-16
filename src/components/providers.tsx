'use client'

import { PermissionProvider } from '@/contexts/permission-context'
import { ModuleProvider } from '@/contexts/module-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PermissionProvider>
      <ModuleProvider>
        {children}
      </ModuleProvider>
    </PermissionProvider>
  )
}
