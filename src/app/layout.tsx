import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { ShellWrapper } from '@/components/layout/shell-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HySP Admin',
  description: 'HySP Admin Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" className="light">
      <body className={inter.className}>
        <Providers>
          <ShellWrapper>{children}</ShellWrapper>
        </Providers>
      </body>
    </html>
  )
}
