import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { UserRole } from '@/types'

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = ['/login', '/forgot-password', '/reset-password', '/summary']

/**
 * Auth routes that authenticated users should be redirected away from
 */
const AUTH_ROUTES = ['/login', '/forgot-password', '/reset-password']

/**
 * Check if user has access to route based on role
 */
function hasRouteAccess(role: UserRole | null, pathname: string): boolean {
  if (!role) return false

  // Admin has access to everything
  if (role === 'admin') return true

  // Define allowed routes per role
  const routePermissions: Record<Exclude<UserRole, 'admin'>, string[]> = {
    employee: ['/dashboard', '/jobs', '/applications', '/saved', '/profile', '/settings'],
    hr: ['/hr/dashboard', '/hr/jobs', '/hr/applicants', '/profile', '/settings'],
    chro: ['/chro/dashboard', '/chro/reports', '/profile', '/settings'],
  }

  const allowedRoutes = routePermissions[role as keyof typeof routePermissions]
  if (!allowedRoutes) return false

  // Check if the pathname starts with any of the allowed routes
  return allowedRoutes.some((route) => pathname.startsWith(route))
}

/**
 * Get the appropriate dashboard redirect for a role
 */
function getDashboardForRole(role: UserRole | null): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'hr':
      return '/hr/dashboard'
    case 'chro':
      return '/chro/dashboard'
    default:
      return '/dashboard'
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes (handled by matcher)
  // But also skip for root path redirect
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Get auth cookies
  const token = request.cookies.get('auth-token')?.value
  const userRole = request.cookies.get('user-role')?.value as UserRole | undefined

  // Check if route is public
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  // Check if route is an auth route (login, etc.)
  const isAuth = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // Validate token exists and has expected format
  const isAuthenticated = token && token.startsWith('mock-token-')

  // Handle unauthenticated users
  if (!isAuthenticated) {
    // Allow access to public routes
    if (isPublic) {
      return NextResponse.next()
    }

    // Redirect to login with return URL
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // User is authenticated from here

  // Redirect authenticated users away from auth pages
  if (isAuth) {
    const dashboard = getDashboardForRole(userRole || null)
    return NextResponse.redirect(new URL(dashboard, request.url))
  }

  // Skip role check for public routes (accessible to all users)
  if (isPublic) {
    return NextResponse.next()
  }

  // Check role-based access for protected routes
  if (userRole) {
    // Admin routes require admin role
    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Check if user has access to this route
    if (!hasRouteAccess(userRole, pathname)) {
      const dashboard = getDashboardForRole(userRole)
      return NextResponse.redirect(new URL(dashboard, request.url))
    }
  }

  // Add user role to request headers for server components
  const response = NextResponse.next()
  if (userRole) {
    response.headers.set('x-user-role', userRole)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}
