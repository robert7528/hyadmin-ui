'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { fetchModules } from '@/lib/micro-app'
import type { Module } from '@/types/module'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const [modules, setModules] = useState<Module[]>([])
  const pathname = usePathname()

  useEffect(() => {
    fetchModules().then(setModules)
  }, [])

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            pathname === '/'
              ? 'bg-primary text-white'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          首頁
        </Link>
        {modules
          .filter((m) => m.enabled)
          .map((m) => (
            <Link
              key={m.name}
              href={`/app/${m.route}`}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname.startsWith(`/app/${m.route}`)
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              {m.displayName}
            </Link>
          ))}
      </nav>
    </aside>
  )
}
