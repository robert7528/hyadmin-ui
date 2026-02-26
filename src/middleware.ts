import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/hyadmin/login', '/hyadmin/_next', '/hyadmin/api']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p)) || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  const token = req.cookies.get('hyadmin_token')?.value
  if (!token) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/hyadmin/login'
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/hyadmin/:path*'],
}
