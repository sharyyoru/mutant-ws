import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('user_session')
  const { pathname } = request.nextUrl

  const isAuthPage = pathname === '/login'
  const isAdminPage = pathname.startsWith('/admin')
  const isPublicPage = pathname === '/' || pathname.startsWith('/_next') || pathname.startsWith('/api')

  // Allow public pages
  if (isPublicPage && !isAdminPage) {
    return NextResponse.next()
  }

  // Redirect to login if no session and not on login page
  if (!session && !isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect to home if has session and on login page
  if (session && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
