'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react'
import { ChevronDown, LayoutGrid, LogOut } from 'lucide-react'
import { useModules } from '@/contexts/module-context'
import { usePermission } from '@/contexts/permission-context'
import { clearToken } from '@/lib/api'
import { cn } from '@/lib/utils'

/** Reserved width for the "應用程式" dropdown button (px) */
const DROPDOWN_BUTTON_WIDTH = 130
/** Gap between tab items (px) */
const TAB_GAP = 4

export function Header() {
  const router = useRouter()
  const { modules, selectedModule, loadModules, selectModule } = useModules()
  const { loadPermissions } = usePermission()
  const [loaded, setLoaded] = useState(false)
  const [maxVisible, setMaxVisible] = useState(modules.length)

  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loaded) {
      setLoaded(true)
      loadPermissions().then(() => loadModules())
    }
  }, [loaded, loadModules, loadPermissions])

  const calcVisible = useCallback(() => {
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure) return

    const available = container.offsetWidth
    const tabs = Array.from(measure.children) as HTMLElement[]
    if (tabs.length === 0) return

    // Check if all tabs fit without the dropdown
    let total = 0
    for (let i = 0; i < tabs.length; i++) {
      total += tabs[i].offsetWidth + (i > 0 ? TAB_GAP : 0)
    }
    if (total <= available) {
      setMaxVisible(tabs.length)
      return
    }

    // Reserve space for dropdown, calculate how many tabs fit
    const budget = available - DROPDOWN_BUTTON_WIDTH
    let used = 0
    let count = 0
    for (let i = 0; i < tabs.length; i++) {
      const w = tabs[i].offsetWidth + (i > 0 ? TAB_GAP : 0)
      if (used + w > budget) break
      used += w
      count++
    }
    setMaxVisible(Math.max(count, 0))
  }, [])

  useEffect(() => {
    calcVisible()
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(calcVisible)
    ro.observe(el)
    return () => ro.disconnect()
  }, [calcVisible, modules])

  const visibleModules = modules.slice(0, maxVisible)
  const overflowModules = modules.slice(maxVisible)

  const handleSelectModule = (mod: (typeof modules)[0]) => {
    selectModule(mod).then(() => {
      router.push(`/app/${mod.route}`)
    })
  }

  const handleLogout = async () => {
    clearToken()
    router.push('/login')
  }

  return (
    <Navbar isBordered className="bg-white shadow-sm">
      <NavbarBrand>
        <span className="font-bold text-lg text-primary">HySP Admin</span>
      </NavbarBrand>

      <NavbarContent className="flex gap-1 overflow-hidden" justify="center">
        {/* Hidden measurement container — renders all tabs off-screen to measure widths */}
        <div
          ref={measureRef}
          aria-hidden
          className="absolute flex gap-1 invisible pointer-events-none h-0 overflow-hidden"
        >
          {modules.map((mod) => (
            <span
              key={mod.id}
              className="px-3 py-1.5 text-sm font-medium whitespace-nowrap"
            >
              {mod.display_name}
            </span>
          ))}
        </div>

        {/* Visible area — ref for ResizeObserver */}
        <div ref={containerRef} className="flex gap-1 items-center w-full min-w-0">
          {visibleModules.map((mod) => (
            <NavbarItem key={mod.id}>
              <button
                onClick={() => handleSelectModule(mod)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
                  selectedModule?.id === mod.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {mod.display_name}
              </button>
            </NavbarItem>
          ))}

          {overflowModules.length > 0 && (
            <NavbarItem>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="light" size="sm" startContent={<LayoutGrid size={14} />} endContent={<ChevronDown size={14} />}>
                    應用程式
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="More modules">
                  {overflowModules.map((mod) => (
                    <DropdownItem key={mod.id} onClick={() => handleSelectModule(mod)}>
                      {mod.display_name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          )}
        </div>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            variant="light"
            size="sm"
            startContent={<LogOut size={14} />}
            onClick={handleLogout}
          >
            登出
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
