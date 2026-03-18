import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { AppBreadcrumb } from '@/components/layout/breadcrumb'
import { useIdleTimeout } from '@/hooks/use-idle-timeout'
import { Sheet, SheetContent } from '@hysp/ui-kit'

export function ShellLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useIdleTimeout(30)

  return (
    <div className="flex h-screen flex-col">
      <Header onMenuClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-60 flex-col border-r bg-background shrink-0">
          <Sidebar />
        </aside>

        {/* Mobile sidebar as Sheet */}
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side="left" className="w-60 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/40">
          <AppBreadcrumb />
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
