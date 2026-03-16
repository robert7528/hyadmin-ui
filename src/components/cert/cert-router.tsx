'use client'

import { usePathname } from 'next/navigation'
import { CertToolbox } from './toolbox'
import { CertList } from './cert-list'

export function CertRouter() {
  const pathname = usePathname()

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
