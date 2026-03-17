'use client'

import Link from 'next/link'
import { useLocale } from '@/contexts/locale-context'

export default function NotFound() {
  const { t } = useLocale()
  const { page } = t.hyadmin.errors

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="text-gray-500">{page.notFound}</p>
      <Link href="/" className="text-primary hover:underline text-sm">
        {page.buttonGoHome}
      </Link>
    </div>
  )
}
