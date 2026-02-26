import Link from 'next/link'

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-6xl font-bold text-gray-200">403</h1>
      <p className="text-gray-500">您沒有存取此功能的權限</p>
      <Link href="/" className="text-primary hover:underline text-sm">
        回首頁
      </Link>
    </div>
  )
}
