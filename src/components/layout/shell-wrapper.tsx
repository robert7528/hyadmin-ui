'use client'

import { usePathname } from 'next/navigation'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { Breadcrumb } from './breadcrumb'
import { useIdleTimeout } from '@/hooks/use-idle-timeout'

const NO_SHELL_PATHS = ['/login', '/hyadmin/login', '/forbidden']

export function ShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showShell = !NO_SHELL_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))

  useIdleTimeout(showShell ? 30 : 0)

  if (!showShell) return <>{children}</>

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <Breadcrumb />
          {children}
        </main>
      </div>
    </div>
  )
}
