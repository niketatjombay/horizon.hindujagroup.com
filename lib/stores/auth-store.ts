import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, UserRole } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  checkAuth: () => Promise<boolean>
  clearError: () => void
}

// Role helper functions (exported separately)
export const isEmployee = (role: UserRole): boolean => role === 'employee'
export const isHR = (role: UserRole): boolean => role === 'hr'
export const isCHRO = (role: UserRole): boolean => role === 'chro'
export const isAdmin = (role: UserRole): boolean => role === 'admin'

/**
 * Sync authentication data to cookies for middleware access
 * Cookies are used because middleware runs on the edge and can't access localStorage
 */
const syncAuthToCookies = (token: string | null, role: UserRole | null) => {
  if (typeof window === 'undefined') return

  const maxAge = 7 * 24 * 60 * 60 // 7 days in seconds

  if (token && role) {
    // Set auth cookies
    document.cookie = `auth-token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`
    document.cookie = `user-role=${role}; path=/; max-age=${maxAge}; SameSite=Lax`
  } else {
    // Clear auth cookies
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const { mockLogin } = await import('@/mock')
          const user = await mockLogin(email, password)
          if (user) {
            const token = `mock-token-${Date.now()}`
            // Sync to cookies for middleware
            syncAuthToCookies(token, user.role)
            set({ user, token, isAuthenticated: true, isLoading: false })
          } else {
            set({ error: 'Invalid credentials', isLoading: false })
          }
        } catch {
          set({ error: 'Login failed', isLoading: false })
        }
      },

      logout: () => {
        // Clear cookies
        syncAuthToCookies(null, null)
        set({ user: null, token: null, isAuthenticated: false, error: null })
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },

      checkAuth: async () => {
        const { token, user } = get()
        if (token && user) {
          return true
        }
        return false
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'horizon-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
