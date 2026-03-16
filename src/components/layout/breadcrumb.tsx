'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useModules } from '@/contexts/module-context'
import { useLocale } from '@/contexts/locale-context'
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

/** Map admin path segments to their sidebar group */
const adminGroupMap: Record<string, string> = {
  users: 'accounts',
  roles: 'accounts',
  modules: 'system',
}

export function AppBreadcrumb() {
  const pathname = usePathname()
  const { selectedModule, features } = useModules()
  const { t } = useLocale()

  const adminLabels: Record<string, string> = {
    users: t.breadcrumb.users,
    roles: t.breadcrumb.roles,
    modules: t.breadcrumb.modules,
    'audit-logs': t.breadcrumb.audit_logs,
    features: t.breadcrumb.features,
    new: t.breadcrumb.new,
  }

  const groupLabels: Record<string, string> = {
    accounts: t.sidebar.group_accounts,
    system: t.sidebar.group_system,
  }

  const segments = pathname.split('/').filter(Boolean)

  const crumbs: { label: string; href?: string }[] = [
    { label: t.breadcrumb.home, href: '/' },
  ]

  if (selectedModule) {
    crumbs.push({ label: selectedModule.display_name })
    const matchedFeature = features.find((f) => {
      const href = `/app/${selectedModule.route}${f.path}`
      return pathname === href || pathname.startsWith(href + '/')
    })
    if (matchedFeature) {
      crumbs.push({ label: matchedFeature.display_name })
    }
  } else if (segments.includes('admin')) {
    crumbs.push({ label: t.breadcrumb.admin })

    const adminSeg = segments[segments.indexOf('admin') + 1]
    if (adminSeg) {
      // Add group level (Accounts / System)
      const groupKey = adminGroupMap[adminSeg]
      if (groupKey && groupLabels[groupKey]) {
        crumbs.push({ label: groupLabels[groupKey] })
      }
      // Add page level
      if (adminLabels[adminSeg]) {
        crumbs.push({ label: adminLabels[adminSeg] })
      }
    }
  }

  if (crumbs.length <= 1) return null

  return (
    <BreadcrumbRoot className="mb-4">
      <BreadcrumbList>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <BreadcrumbItem key={i}>
              {i > 0 && <BreadcrumbSeparator />}
              {isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : crumb.href ? (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </BreadcrumbRoot>
  )
}
