'use client'

import type { ReactNode } from 'react'
import { usePermission } from '@/contexts/permission-context'

interface PermissionGuardProps {
  code: string
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Render children only when the current user has the given permission code.
 * Returns fallback (default: null) otherwise.
 */
export function PermissionGuard({ code, children, fallback = null }: PermissionGuardProps) {
  const { hasPermission } = usePermission()
  return hasPermission(code) ? <>{children}</> : <>{fallback}</>
}
