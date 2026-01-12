import type { UserRole } from '@/types'

/**
 * Validate JWT token (mock implementation)
 * In production, this would decode and verify actual JWT
 */
export function validateToken(token: string | null | undefined): boolean {
  if (!token) return false

  // Mock validation: Check if token starts with expected prefix
  return token.startsWith('mock-token-')
}

/**
 * Extract user role from token (mock implementation)
 * In production, this would decode JWT payload
 *
 * Token format: mock-token-{timestamp}-{userId}-{role}
 */
export function getUserRoleFromToken(token: string | null | undefined): UserRole | null {
  if (!validateToken(token)) return null

  // Parse the token to extract role
  // Token is set as: mock-token-{timestamp} from auth store
  // We'll need to get role from the stored user data via cookie
  // For now, return null as role is stored separately
  return null
}

/**
 * Check if user has access to route based on role
 */
export function hasRouteAccess(role: UserRole | null, pathname: string): boolean {
  if (!role) return false

  // Admin (super admin) has access to everything
  if (role === 'admin') return true

  // Define allowed routes per role
  const routePermissions: Record<UserRole, string[]> = {
    employee: ['/dashboard', '/jobs', '/applications', '/saved', '/profile'],
    hr: ['/hr/dashboard', '/hr/jobs', '/applicants', '/profile'],
    chro: ['/chro/dashboard', '/chro/reports', '/profile'],
    admin: [], // Admin can access all (handled above)
  }

  const allowedRoutes = routePermissions[role]

  // Check if the pathname starts with any of the allowed routes
  return allowedRoutes.some((route) => pathname.startsWith(route))
}

/**
 * Get the appropriate dashboard redirect for a role
 */
export function getDashboardForRole(role: UserRole | null): string {
  if (role === 'admin') {
    return '/admin/dashboard'
  }
  return '/dashboard'
}

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [
  '/login',
  '/forgot-password',
  '/reset-password',
  '/',
]

/**
 * Auth routes that authenticated users should be redirected away from
 */
export const AUTH_ROUTES = ['/login', '/forgot-password', '/reset-password']

/**
 * Check if a route is public
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || (route !== '/' && pathname.startsWith(route))
  )
}

/**
 * Check if a route is an auth route
 */
export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route))
}
