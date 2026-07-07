// frontend/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Only needs refreshToken
const STANDARD_PROTECTED = ['/cart', '/profile', '/wishlist', '/wallet', '/order']

// Needs refreshToken + otpId cookie (mid-setup flow)
const SETUP_ROUTES: Record<string, string> = {
  '/seller/setup': 'seller',
  '/affiliate/setup': 'affiliate',
}

// Needs refreshToken + NO hasSellerAccount/hasAffiliateAccount yet
const OTP_VERIFY_ROUTES: Record<string, string> = {
  '/seller/verify-email': 'seller',
  '/affiliate/verify-email': 'affiliate',
}

// Needs refreshToken + hasSellerAccount or hasAffiliateAccount cookie
const ROLE_PREFIXES: Record<string, string> = {
  '/seller': 'seller',
  '/affiliate': 'affiliate',
}

const AUTH_ROUTES = ['/login', '/register']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const refreshToken = request.cookies.get('refreshToken')?.value
  const otpId = request.cookies.get('otpVerified')?.value
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

  const otpVerifyRole = Object.entries(OTP_VERIFY_ROUTES).find(([r]) =>
    pathname.startsWith(r)
  )?.[1]

  if (otpVerifyRole) {
    if (!isLoggedIn) return toLogin()

    if (hasSellerAccount === "true") {
      return NextResponse.redirect(
        new URL(`/seller/dashboard`, request.url)
      )
    }

    if (hasAffiliateAccount === "true") {
      return NextResponse.redirect(
        new URL(`/affiliate/dashboard`, request.url)
      )
    }

    if (otpId) {
      return NextResponse.redirect(
        new URL(`/${otpVerifyRole}/setup`, request.url)
      )
    }

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

    if (!otpId) {
      return NextResponse.redirect(
        new URL(`/${setupRole}/verify-email`, request.url)
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
        new URL(`/${role}/verify-email`, request.url)
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