'use client'

import { useLocale } from '@/contexts/locale-context'

export default function HomePage() {
  const { t } = useLocale()
  const { title, hint } = t.hyadmin.dashboard.header

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      <p className="text-gray-500">{hint}</p>
    </div>
  )
}
