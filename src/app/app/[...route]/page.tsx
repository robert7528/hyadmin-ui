'use client'

import { useParams } from 'next/navigation'
import { useModules } from '@/contexts/module-context'
import { useLocale } from '@/contexts/locale-context'
import { AppContainer } from '@/components/micro-app/app-container'

export default function AppPage() {
  const params = useParams()
  const route = (Array.isArray(params.route) ? params.route[0] : params.route) ?? ''
  const { modules } = useModules()
  const { t } = useLocale()

  const mod = modules.find((m) => m.route === route && m.enabled)

  if (!mod || !mod.url) {
    return (
      <div className="text-muted-foreground text-sm py-8 text-center">
        {t.hyadmin.errors.page.moduleNotFound}
      </div>
    )
  }

  // All modules are micro-apps
  return <AppContainer module={mod} />
}
