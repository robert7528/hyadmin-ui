'use client'

import { useParams } from 'next/navigation'
import { useModules } from '@/contexts/module-context'
import { AppContainer } from '@/components/micro-app/app-container'

export default function AppPage() {
  const params = useParams()
  const route = Array.isArray(params.route) ? params.route[0] : params.route
  const { modules } = useModules()

  const mod = modules.find((m) => m.route === route && m.enabled)

  if (!mod) {
    return (
      <div className="text-gray-500 text-sm py-8 text-center">
        模組未找到或未啟用。
      </div>
    )
  }

  return <AppContainer module={mod} />
}
