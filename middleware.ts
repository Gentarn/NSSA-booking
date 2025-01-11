import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin') && 
    !request.nextUrl.pathname.startsWith('/admin-login')
  const isAuthenticated = request.cookies.get('admin_authenticated')?.value === 'true'

  console.log('Middleware triggered:', {
    path: request.nextUrl.pathname,
    isAdminPage,
    isAuthenticated,
    cookies: request.cookies.getAll()
  })

  // Redirect to admin page if already authenticated
  if (request.nextUrl.pathname === '/login' && isAuthenticated) {
    console.log('Redirecting to /admin (already authenticated)')
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Redirect to login page if trying to access admin page without authentication
  if (isAdminPage && !isAuthenticated) {
    console.log('Redirecting to /login (not authenticated)')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  console.log('Allowing request to proceed')
  return NextResponse.next()
}
