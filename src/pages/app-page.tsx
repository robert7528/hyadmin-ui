import { useParams } from 'react-router-dom'
import { useModules } from '@/contexts/module-context'
import { useLocale } from '@/contexts/locale-context'
import { AppContainer } from '@/components/micro-app/app-container'
import { Loader2 } from 'lucide-react'

export default function AppPage() {
  const { route } = useParams<{ route: string }>()
  const { modules } = useModules()
  const { t } = useLocale()

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

  return <AppContainer key={mod.name} module={mod} />
}
