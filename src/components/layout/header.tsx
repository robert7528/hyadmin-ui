'use client'

import { useEffect, useRef, useState } from 'react'
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

/** Approx width reserved for Brand + End section + padding */
const RESERVED_WIDTH = 320
/** Width of the "應用程式" dropdown button (px) */
const DROPDOWN_WIDTH = 130
/** Horizontal padding per tab (px-3 = 12px * 2) + gap */
const TAB_PADDING = 28

function useMaxVisibleTabs(modules: { display_name: string }[]) {
  const [maxVisible, setMaxVisible] = useState(modules.length)
  const canvasRef = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (modules.length === 0) return

    // Measure tab text widths using Canvas (no DOM needed)
    if (!canvasRef.current) {
      const canvas = document.createElement('canvas')
      canvasRef.current = canvas.getContext('2d')
    }
    const ctx = canvasRef.current
    if (!ctx) return
    ctx.font = '500 14px ui-sans-serif, system-ui, sans-serif'

    const tabWidths = modules.map(
      (m) => ctx.measureText(m.display_name).width + TAB_PADDING
    )

    const calc = () => {
      const available = window.innerWidth - RESERVED_WIDTH

      // Check if all tabs fit without dropdown
      const totalWidth = tabWidths.reduce((a, b) => a + b, 0)
      if (totalWidth <= available) {
        setMaxVisible(modules.length)
        return
      }

      // Reserve space for dropdown, fit as many as possible
      const budget = available - DROPDOWN_WIDTH
      let used = 0
      let count = 0
      for (const w of tabWidths) {
        if (used + w > budget) break
        used += w
        count++
      }
      setMaxVisible(Math.max(count, 0))
    }

    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [modules])

  return maxVisible
}

export function Header() {
  const router = useRouter()
  const { modules, selectedModule, loadModules, selectModule } = useModules()
  const { loadPermissions } = usePermission()
  const [loaded, setLoaded] = useState(false)

  const maxVisible = useMaxVisibleTabs(modules)

  useEffect(() => {
    if (!loaded) {
      setLoaded(true)
      loadPermissions().then(() => loadModules())
    }
  }, [loaded, loadModules, loadPermissions])

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

      <NavbarContent className="flex gap-1" justify="center">
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
