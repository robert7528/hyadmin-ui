'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useModules } from '@/contexts/module-context'
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const adminLabels: Record<string, string> = {
  users: '使用者管理',
  roles: '角色管理',
  modules: '模組管理',
  'audit-logs': '稽核日誌',
  features: '功能設定',
  new: '新增',
}

export function AppBreadcrumb() {
  const pathname = usePathname()
  const { selectedModule, features } = useModules()

  const segments = pathname.split('/').filter(Boolean)

  // Build breadcrumb: Home -> Module -> Feature
  const crumbs: { label: string; href?: string }[] = [
    { label: '首頁', href: '/' },
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
    crumbs.push({ label: '管理設定' })
    const adminSeg = segments[segments.indexOf('admin') + 1]
    if (adminSeg && adminLabels[adminSeg]) {
      crumbs.push({ label: adminLabels[adminSeg] })
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
