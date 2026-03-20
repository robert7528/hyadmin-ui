import { useParams, useLocation } from 'react-router-dom'
import { useModules } from '@/contexts/module-context'
import { useLocale } from '@/contexts/locale-context'
import { AppContainer } from '@/components/micro-app/app-container'
import { Loader2 } from 'lucide-react'

export default function AppPage() {
  const { route } = useParams<{ route: string }>()
  const { modules } = useModules()
  const { t } = useLocale()
  const location = useLocation()

  // modules still loading
  if (modules.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  const mod = modules.find((m) => m.route === route && m.enabled)

  if (!mod || !mod.url) {
    return (
      <div className="text-muted-foreground text-sm py-8 text-center">
        {t.hyadmin.errors.page.moduleNotFound}
      </div>
    )
  }

  // Extract sub-path after /app/{route} and append to sub-app URL
  // e.g., /app/cert/list → subPath = /list
  const prefix = `/app/${route}`
  const subPath = location.pathname.startsWith(prefix)
    ? location.pathname.slice(prefix.length)
    : ''
  const subAppUrl = subPath ? `${mod.url}${subPath}` : mod.url

  return <AppContainer key={`${mod.name}-${subPath}`} module={mod} url={subAppUrl} />
}
