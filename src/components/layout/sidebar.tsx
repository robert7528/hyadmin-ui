'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useModules } from '@/contexts/module-context'
import { useLocale } from '@/contexts/locale-context'
import { cn, Collapsible, CollapsibleContent, CollapsibleTrigger } from '@hysp/ui-kit'
import { ChevronRight, Users, Shield, Package, ScrollText, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface MenuItem {
  label: string
  href: string
  icon: LucideIcon
}

interface MenuGroup {
  label: string
  icon: LucideIcon
  items: MenuItem[]
  /** If set, the group itself is a link (no children) */
  href?: string
}

export function Sidebar() {
  const pathname = usePathname()
  const { selectedModule, features } = useModules()
  const { t } = useLocale()

  const { nav } = t.hyadmin.sidebar
  const moduleNames = t.hyadmin.moduleNames.display
  const featureNames = t.hyadmin.featureNames.display

  const isAdmin =
    pathname.startsWith('/admin') || pathname.startsWith('/hyadmin/admin')

  // Admin: 2-level grouped menu
  const adminGroups: MenuGroup[] = [
    {
      label: nav.groupAccounts,
      icon: Users,
      items: [
        { label: nav.users, href: '/admin/users', icon: Users },
        { label: nav.roles, href: '/admin/roles', icon: Shield },
      ],
    },
    {
      label: nav.groupSystem,
      icon: Package,
      items: [
        { label: nav.modules, href: '/admin/modules', icon: Package },
      ],
    },
    {
      label: nav.auditLogs,
      icon: ScrollText,
      href: '/admin/audit-logs',
      items: [],
    },
  ]

  // Module features: flat list (1 level)
  const featureItems: MenuItem[] = features
    .filter((f) => f.enabled)
    .map((f) => ({
      label: featureNames[f.name] ?? f.display_name,
      href: selectedModule
        ? `/app/${selectedModule.route}${f.path}`
        : `/app${f.path}`,
      icon: Settings,
    }))

  const sectionTitle = isAdmin
    ? t.hyadmin.header.nav.admin
    : selectedModule
      ? (moduleNames[selectedModule.name] ?? selectedModule.display_name)
      : undefined

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
            {nav.selectModule}
          </p>
        )}

        {isAdmin ? (
          // 2-level admin menu
          adminGroups.map((group) =>
            group.href ? (
              // Single link (no children)
              <SidebarLink
                key={group.href}
                href={group.href}
                icon={group.icon}
                label={group.label}
                active={pathname === group.href || pathname.startsWith(group.href + '/')}
              />
            ) : (
              // Collapsible group
              <SidebarGroup
                key={group.label}
                group={group}
                pathname={pathname}
              />
            )
          )
        ) : (
          // Flat feature list
          featureItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href || pathname.startsWith(item.href + '/')}
            />
          ))
        )}
      </nav>
    </div>
  )
}

function SidebarLink({
  href,
  icon: Icon,
  label,
  active,
  indent = false,
}: {
  href: string
  icon: LucideIcon
  label: string
  active: boolean
  indent?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        active && 'bg-accent text-accent-foreground font-medium',
        indent && 'pl-9'
      )}
    >
      {!indent && <Icon size={16} />}
      {label}
    </Link>
  )
}

function SidebarGroup({
  group,
  pathname,
}: {
  group: MenuGroup
  pathname: string
}) {
  const hasActiveChild = group.items.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  )
  const [open, setOpen] = useState(hasActiveChild)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
        <group.icon size={16} />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronRight
          size={14}
          className={cn(
            'transition-transform text-muted-foreground',
            open && 'rotate-90'
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1">
        {group.items.map((item) => (
          <SidebarLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={pathname === item.href || pathname.startsWith(item.href + '/')}
            indent
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
