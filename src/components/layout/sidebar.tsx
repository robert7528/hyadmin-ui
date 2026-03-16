'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useModules } from '@/contexts/module-context'
import { cn } from '@/lib/utils'
import { Users, Shield, Package, ScrollText, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface MenuItem {
  label: string
  href: string
  icon: LucideIcon
}

const adminMenuItems: MenuItem[] = [
  { label: '使用者管理', href: '/admin/users', icon: Users },
  { label: '角色管理', href: '/admin/roles', icon: Shield },
  { label: '模組管理', href: '/admin/modules', icon: Package },
  { label: '稽核日誌', href: '/admin/audit-logs', icon: ScrollText },
]

export function Sidebar() {
  const pathname = usePathname()
  const { selectedModule, features } = useModules()
  const isAdmin =
    pathname.startsWith('/admin') || pathname.startsWith('/hyadmin/admin')

  const items: MenuItem[] = isAdmin
    ? adminMenuItems
    : features
        .filter((f) => f.enabled)
        .map((f) => ({
          label: f.display_name,
          href: selectedModule
            ? `/app/${selectedModule.route}${f.path}`
            : `/app${f.path}`,
          icon: Settings,
        }))

  const sectionTitle = isAdmin
    ? '系統管理'
    : selectedModule?.display_name

  return (
    <div className="flex flex-col h-full">
      {sectionTitle && (
        <div className="px-4 py-3 border-b">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {sectionTitle}
          </p>
        </div>
      )}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {!isAdmin && !selectedModule && (
          <p className="text-sm text-muted-foreground px-3 py-2">
            請從頂部選擇模組
          </p>
        )}
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                active && 'bg-accent text-accent-foreground font-medium'
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
