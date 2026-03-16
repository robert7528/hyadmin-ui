'use client'

import { LocaleProvider } from '@/contexts/locale-context'
import { PermissionProvider } from '@/contexts/permission-context'
import { ModuleProvider } from '@/contexts/module-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <PermissionProvider>
        <ModuleProvider>
          {children}
        </ModuleProvider>
      </PermissionProvider>
    </LocaleProvider>
  )
}
