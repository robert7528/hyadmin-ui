import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="text-gray-500">找不到此頁面</p>
      <Link href="/" className="text-primary hover:underline text-sm">
        回首頁
      </Link>
    </div>
  )
}
