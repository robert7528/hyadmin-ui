'use client'

import { useParams } from 'next/navigation'
import { useModules } from '@/contexts/module-context'
import { useLocale } from '@/contexts/locale-context'
import { AppContainer } from '@/components/micro-app/app-container'

export default function AppPage() {
  const params = useParams()
  const route = Array.isArray(params.route) ? params.route[0] : params.route
  const { modules } = useModules()
  const { t } = useLocale()

  const mod = modules.find((m) => m.route === route && m.enabled)

  if (!mod) {
    return (
      <div className="text-muted-foreground text-sm py-8 text-center">
        {t.errors.module_not_found}
      </div>
    )
  }

  return <AppContainer module={mod} />
}
