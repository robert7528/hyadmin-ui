'use client'

import { useEffect, useState } from 'react'
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
import { ChevronDown, LogOut } from 'lucide-react'
import { useModules } from '@/contexts/module-context'
import { usePermission } from '@/contexts/permission-context'
import { clearToken } from '@/lib/api'
import { cn } from '@/lib/utils'

const MAX_VISIBLE_TABS = 6

export function Header() {
  const router = useRouter()
  const { modules, selectedModule, loadModules, selectModule } = useModules()
  const { loadPermissions } = usePermission()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loaded) {
      setLoaded(true)
      loadPermissions().then(() => loadModules())
    }
  }, [loaded, loadModules, loadPermissions])

  const visibleModules = modules.slice(0, MAX_VISIBLE_TABS)
  const overflowModules = modules.slice(MAX_VISIBLE_TABS)

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

      <NavbarContent className="flex gap-1 overflow-x-auto" justify="center">
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
                <Button variant="light" size="sm" endContent={<ChevronDown size={14} />}>
                  更多
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
