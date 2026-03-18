import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { MoreHorizontal, LogOut, Menu, User, Globe } from 'lucide-react'
import { useModules } from '@/contexts/module-context'
import { usePermission } from '@/contexts/permission-context'
import { useLocale } from '@/contexts/locale-context'
import { localeLabels, type Locale } from '@/i18n'
import { clearToken } from '@/lib/api'
import {
  cn,
  Button,
  Separator,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@hysp/ui-kit'

/** Approx width reserved for Brand + End section + padding */
const RESERVED_WIDTH = 320
/** Width of the overflow "..." dropdown button (px) */
const DROPDOWN_WIDTH = 50
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

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { modules, selectedModule, loadModules, selectModule } = useModules()
  const { loadPermissions } = usePermission()
  const { t, locale, setLocale } = useLocale()
  const [loaded, setLoaded] = useState(false)

  const { nav } = t.hyadmin.header
  const moduleNames = t.hyadmin.moduleNames.display

  const maxVisible = useMaxVisibleTabs(modules)

  useEffect(() => {
    if (!loaded) {
      setLoaded(true)
      loadPermissions().then(() => loadModules())
    }
  }, [loaded, loadModules, loadPermissions])

  const visibleModules = modules.slice(0, maxVisible)
  const overflowModules = modules.slice(maxVisible)

  const isAdmin = pathname.startsWith('/admin')

  const handleSelectModule = (mod: (typeof modules)[0]) => {
    selectModule(mod).then(() => {
      navigate(`/app/${mod.route}`)
    })
  }

  const handleAdminClick = () => {
    navigate('/admin/users')
  }

  const handleLogout = async () => {
    clearToken()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center border-b bg-background px-4">
      {/* Mobile menu button */}
      {onMenuClick && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2 h-8 w-8"
          onClick={onMenuClick}
        >
          <Menu size={16} />
        </Button>
      )}

      {/* Left: Logo — fixed width to align with sidebar */}
      <div className="hidden md:flex w-60 shrink-0 items-center border-r mr-4 -ml-4 pl-4 h-full">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-primary"
        >
          HySP Console
        </Link>
      </div>
      {/* Mobile: Logo without fixed width */}
      <Link
        to="/"
        className="md:hidden flex items-center gap-2 font-semibold text-primary mr-2 shrink-0"
      >
        HySP Console
      </Link>

      {/* Center: Module tabs */}
      <div className="flex-1 flex items-center gap-1 overflow-hidden min-w-0">
        {visibleModules.map((mod) => {
          const active = selectedModule?.id === mod.id && !isAdmin
          return (
            <Button
              key={mod.id}
              variant={active ? 'secondary' : 'ghost'}
              size="sm"
              className={cn(
                'shrink-0 whitespace-nowrap',
                active && 'font-semibold'
              )}
              onClick={() => handleSelectModule(mod)}
            >
              {moduleNames[mod.name] ?? mod.display_name}
            </Button>
          )
        })}

        {overflowModules.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="shrink-0">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {overflowModules.map((mod) => (
                <DropdownMenuItem
                  key={mod.id}
                  onClick={() => handleSelectModule(mod)}
                >
                  {moduleNames[mod.name] ?? mod.display_name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Admin pseudo-tab */}
        <Button
          variant={isAdmin ? 'secondary' : 'ghost'}
          size="sm"
          className={cn('shrink-0 whitespace-nowrap', isAdmin && 'font-semibold')}
          onClick={handleAdminClick}
        >
          {nav.admin}
        </Button>
      </div>

      {/* Language switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
            <Globe size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {(Object.entries(localeLabels) as [Locale, string][]).map(([key, label]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => setLocale(key)}
              className={locale === key ? 'font-semibold' : ''}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Right: User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="ml-2 shrink-0 gap-1.5">
            <User size={16} />
            <span className="hidden sm:inline">admin</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            {nav.profile}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut size={14} className="mr-2" />
            {nav.logout}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
