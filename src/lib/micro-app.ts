import type { Module } from '@/types/module'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

export async function fetchModules(): Promise<Module[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/modules`, {
      headers: {
        'X-Tenant-ID': getTenantId(),
      },
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.modules ?? []
  } catch {
    return []
  }
}

function getTenantId(): string {
  return process.env.NEXT_PUBLIC_TENANT_ID ?? 'default'
}

export function initMicroApp() {
  if (typeof window === 'undefined') return
  import('@micro-zoe/micro-app').then(({ default: microApp }) => {
    microApp.start()
  })
}
