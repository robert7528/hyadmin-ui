'use client'

import { useLocale } from '@/contexts/locale-context'

export default function HomePage() {
  const { t } = useLocale()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800">{t.dashboard.title}</h1>
      <p className="text-gray-500">{t.dashboard.hint}</p>
    </div>
  )
}
