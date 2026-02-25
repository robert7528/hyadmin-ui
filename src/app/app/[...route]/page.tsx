'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchModules } from '@/lib/micro-app'
import { AppContainer } from '@/components/micro-app/app-container'
import type { Module } from '@/types/module'

export default function AppPage() {
  const params = useParams()
  const route = Array.isArray(params.route) ? params.route[0] : params.route
  const [mod, setMod] = useState<Module | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModules().then((modules) => {
      setMod(modules.find((m) => m.route === route && m.enabled) ?? null)
      setLoading(false)
    })
  }, [route])

  if (loading) {
    return <div className="text-gray-400 text-sm">載入中...</div>
  }
  if (!mod) {
    return <div className="text-gray-500 text-sm">模組未找到或未啟用。</div>
  }
  return <AppContainer module={mod} />
}
