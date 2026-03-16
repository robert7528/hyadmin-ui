'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useModules } from '@/contexts/module-context'
import { setCertApiBase } from '@/lib/cert-api'
import { CertToolbox } from './toolbox'
import { CertList } from './cert-list'

export function CertRouter() {
  const pathname = usePathname()
  const { selectedModule } = useModules()

  useEffect(() => {
    if (selectedModule?.api_url) {
      setCertApiBase(selectedModule.api_url)
    }
  }, [selectedModule])

  // Match /app/cert/toolbox or /hyadmin/app/cert/toolbox
  if (pathname.includes('/toolbox')) {
    return <CertToolbox />
  }

  if (pathname.includes('/list')) {
    return <CertList />
  }

  // Default: show toolbox
  return <CertToolbox />
}
