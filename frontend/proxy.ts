// frontend/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Only needs refreshToken
const STANDARD_PROTECTED = ['/cart', '/profile', '/wishlist', '/wallet', '/order']

// Needs refreshToken + otpId cookie (mid-setup flow)
const SETUP_ROUTES: Record<string, string> = {
  '/seller/register': 'seller',
  '/affiliate/register': 'affiliate',
}

// Needs refreshToken + hasSellerAccount or hasAffiliateAccount cookie
const ROLE_PREFIXES: Record<string, string> = {
  '/seller': 'seller',
  '/affiliate': 'affiliate',
}

const AUTH_ROUTES = ['/login', '/register']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const refreshToken = request.cookies.get('refreshToken')?.value;
  const hasSellerAccount = request.cookies.get('hasSellerAccount')?.value
  const hasAffiliateAccount = request.cookies.get('hasAffiliateAccount')?.value

  const isLoggedIn = !!refreshToken

  const toLogin = () => {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (isLoggedIn) return NextResponse.redirect(new URL('/', request.url))
    return NextResponse.next()
  }

  
  const setupRole = Object.entries(SETUP_ROUTES).find(([r]) =>
    pathname.startsWith(r)
  )?.[1]

  if (setupRole) {
    if (!isLoggedIn) return toLogin()

    const hasAccount = hasSellerAccount || hasAffiliateAccount
    if (hasAccount) {
      return NextResponse.redirect(
        new URL(`/${setupRole}/dashboard`, request.url)
      )
    }

    return NextResponse.next()
  }

  const roleEntry = Object.entries(ROLE_PREFIXES).find(([r]) =>
    pathname.startsWith(r)
  )

  if (roleEntry) {
    const role = roleEntry[1]

    if (!isLoggedIn) return toLogin()

    const hasAccount =
      role === 'seller' ? hasSellerAccount : hasAffiliateAccount

    if (!hasAccount) {
      return NextResponse.redirect(
        new URL(`/${role}/register`, request.url)
      )
    }

    return NextResponse.next()
  }

  if (STANDARD_PROTECTED.some((r) => pathname === r || pathname.startsWith(r + '/'))) {
    if (!isLoggedIn) return toLogin()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/cart',
    '/cart/:path*',
    '/profile',
    '/profile/:path*',
    '/wishlist',
    '/wishlist/:path*',
    '/wallet',
    '/wallet/:path*',
    '/seller/:path*',
    '/affiliate/:path*',
    '/login',
    '/register',
  ],
}