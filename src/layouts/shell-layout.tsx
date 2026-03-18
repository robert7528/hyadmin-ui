import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { AppBreadcrumb } from '@/components/layout/breadcrumb'
import { useIdleTimeout } from '@/hooks/use-idle-timeout'
import { useModules } from '@/contexts/module-context'
import { Sheet, SheetContent } from '@hysp/ui-kit'

export function ShellLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const { modules, selectedModule, selectModule } = useModules()

  useIdleTimeout(30)

  // Auto-select module from URL after page refresh
  useEffect(() => {
    if (selectedModule || modules.length === 0) return

    const match = pathname.match(/^\/app\/([^/]+)/)
    if (!match) return

    const route = match[1]
    const mod = modules.find((m) => m.route === route && m.enabled)
    if (mod) {
      selectModule(mod)
    }
  }, [modules, selectedModule, pathname, selectModule])

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
