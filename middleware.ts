import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
  const isAuthenticated = request.cookies.get('admin_authenticated')

  if (isAdminPage && !isAuthenticated) {
    return NextResponse.redirect(new URL('/admin-login', request.url))
  }

  return NextResponse.next()
}

