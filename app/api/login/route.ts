import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  response.cookies.set({
    name: 'admin_authenticated',
    value: 'true',
    path: '/',
    maxAge: 3600,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })

  return response
}
