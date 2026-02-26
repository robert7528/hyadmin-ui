'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { useModules } from '@/contexts/module-context'

export function Breadcrumb() {
  const pathname = usePathname()
  const { selectedModule, features } = useModules()

  const segments = pathname.split('/').filter(Boolean)

  // Build breadcrumb: Home → Module → Feature
  const crumbs: { label: string; href?: string }[] = [{ label: '首頁', href: '/' }]

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
    const labels: Record<string, string> = {
      modules: '模組管理',
      features: '功能管理',
      users: '使用者管理',
      roles: '角色管理',
      'audit-logs': '稽核日誌',
    }
    if (adminSeg && labels[adminSeg]) {
      crumbs.push({ label: labels[adminSeg] })
    }
  }

  if (crumbs.length <= 1) return null

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 mb-4">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={12} className="text-gray-300" />}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-primary transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className={i === crumbs.length - 1 ? 'text-gray-700 font-medium' : ''}>
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
