import { Outlet } from 'react-router-dom'
import { Providers } from '@/components/providers'

export function RootLayout() {
  return (
    <Providers>
      <Outlet />
    </Providers>
  )
}
