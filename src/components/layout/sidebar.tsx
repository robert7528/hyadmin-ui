'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useModules } from '@/contexts/module-context'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const { selectedModule, features } = useModules()
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col">
      {selectedModule && (
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {selectedModule.display_name}
          </p>
        </div>
      )}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {!selectedModule && (
          <p className="text-sm text-gray-400 px-3 py-2">請從頂部選擇模組</p>
        )}
        {features
          .filter((f) => f.enabled)
          .map((f) => {
            const href = selectedModule
              ? `/app/${selectedModule.route}${f.path}`
              : `/app${f.path}`
            return (
              <Link
                key={f.id}
                href={href}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  pathname === href || pathname.startsWith(href + '/')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {f.display_name}
              </Link>
            )
          })}
      </nav>
    </aside>
  )
}
