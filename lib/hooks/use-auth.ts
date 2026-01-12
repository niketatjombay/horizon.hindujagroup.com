import { useAuthStore, isEmployee, isHR, isCHRO, isAdmin } from '@/lib/stores/auth-store'

export function useAuth() {
  const store = useAuthStore()

  return {
    ...store,
    // Role checks using current user
    isEmployee: store.user ? isEmployee(store.user.role) : false,
    isHR: store.user ? isHR(store.user.role) : false,
    isCHRO: store.user ? isCHRO(store.user.role) : false,
    isAdmin: store.user ? isAdmin(store.user.role) : false,
  }
}

// Re-export role helpers for use outside of hooks
export { isEmployee, isHR, isCHRO, isAdmin }
