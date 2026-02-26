'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { permissionsApi } from '@/lib/api'

interface PermissionContextValue {
  permissionCodes: Set<string>
  loadPermissions: () => Promise<void>
  hasPermission: (code: string) => boolean
}

const PermissionContext = createContext<PermissionContextValue>({
  permissionCodes: new Set(),
  loadPermissions: async () => {},
  hasPermission: () => false,
})

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const [permissionCodes, setPermissionCodes] = useState<Set<string>>(new Set())

  const loadPermissions = useCallback(async () => {
    try {
      const data = await permissionsApi.me()
      setPermissionCodes(new Set(data.permissions))
    } catch {
      setPermissionCodes(new Set())
    }
  }, [])

  const hasPermission = useCallback(
    (code: string) => permissionCodes.has(code),
    [permissionCodes]
  )

  const value = useMemo(
    () => ({ permissionCodes, loadPermissions, hasPermission }),
    [permissionCodes, loadPermissions, hasPermission]
  )

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>
}

export function usePermission() {
  return useContext(PermissionContext)
}
