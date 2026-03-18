import { useLocation, Link } from 'react-router-dom'
import { useModules } from '@/contexts/module-context'
import { useLocale } from '@/contexts/locale-context'
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@hysp/ui-kit'

/** Map admin path segments to their sidebar group */
const adminGroupMap: Record<string, string> = {
  users: 'accounts',
  roles: 'accounts',
  modules: 'system',
}

export function AppBreadcrumb() {
  const { pathname } = useLocation()
  const { selectedModule, features } = useModules()
  const { t } = useLocale()

  const { nav: breadcrumbNav } = t.hyadmin.breadcrumb
  const { nav: sidebarNav } = t.hyadmin.sidebar
  const moduleNames = t.hyadmin.moduleNames.display
  const featureNames = t.hyadmin.featureNames.display

  const adminLabels: Record<string, string> = {
    users: breadcrumbNav.users,
    roles: breadcrumbNav.roles,
    modules: breadcrumbNav.modules,
    'audit-logs': breadcrumbNav.auditLogs,
    features: breadcrumbNav.features,
    new: breadcrumbNav.new,
  }

  const groupLabels: Record<string, string> = {
    accounts: sidebarNav.groupAccounts,
    system: sidebarNav.groupSystem,
  }

  const segments = pathname.split('/').filter(Boolean)

  const crumbs: { label: string; href?: string }[] = [
    { label: breadcrumbNav.home, href: '/' },
  ]

  const isAdminRoute = segments.includes('admin') || segments.includes('profile')

  if (isAdminRoute) {
    crumbs.push({ label: breadcrumbNav.admin })

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
  } else if (selectedModule) {
    crumbs.push({ label: moduleNames[selectedModule.name] ?? selectedModule.display_name })
    const matchedFeature = features.find((f) => {
      const href = `/app/${selectedModule.route}${f.path}`
      return pathname === href || pathname.startsWith(href + '/')
    })
    if (matchedFeature) {
      crumbs.push({ label: featureNames[matchedFeature.name] ?? matchedFeature.display_name })
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
                  <Link to={crumb.href}>{crumb.label}</Link>
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
