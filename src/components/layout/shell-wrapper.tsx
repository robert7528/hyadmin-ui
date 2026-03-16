'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { AppBreadcrumb } from './breadcrumb'
import { useIdleTimeout } from '@/hooks/use-idle-timeout'
import { Sheet, SheetContent } from '@/components/ui/sheet'

const NO_SHELL_PATHS = ['/login', '/hyadmin/login', '/forbidden']

export function ShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showShell = !NO_SHELL_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useIdleTimeout(showShell ? 30 : 0)

  if (!showShell) return <>{children}</>

  return (
    <div className="flex h-screen flex-col">
      <Header onMenuClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-56 flex-col border-r bg-background shrink-0">
          <Sidebar />
        </aside>

        {/* Mobile sidebar as Sheet */}
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side="left" className="w-56 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/40">
          <AppBreadcrumb />
          <div>{children}</div>
        </main>
      </div>
    </div>
  )
}
