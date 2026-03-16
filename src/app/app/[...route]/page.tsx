'use client'

import { useParams, usePathname } from 'next/navigation'
import { useModules } from '@/contexts/module-context'
import { useLocale } from '@/contexts/locale-context'
import { AppContainer } from '@/components/micro-app/app-container'
import { CertRouter } from '@/components/cert/cert-router'

/** Modules that render native pages instead of micro-app */
const nativeModules: Record<string, React.ComponentType> = {
  cert: CertRouter,
}

export default function AppPage() {
  const params = useParams()
  const pathname = usePathname()
  const route = (Array.isArray(params.route) ? params.route[0] : params.route) ?? ''
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

  // Native module: render built-in pages
  const NativeComponent = nativeModules[route]
  if (NativeComponent || !mod.url) {
    return NativeComponent ? <NativeComponent /> : (
      <div className="text-muted-foreground text-sm py-8 text-center">
        {t.errors.module_not_found}
      </div>
    )
  }

  // Micro-app module
  return <AppContainer module={mod} />
}
