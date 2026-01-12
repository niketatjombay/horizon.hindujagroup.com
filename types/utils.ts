import type { Pagination } from './api'

// Make all properties optional recursively
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Make specific keys required
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

// Make specific keys optional
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Extract only nullable keys
export type NullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? K : never
}[keyof T]

// Async function return type
export type AsyncReturnType<T extends (...args: unknown[]) => Promise<unknown>> =
  T extends (...args: unknown[]) => Promise<infer R> ? R : never

// API state type for loading/error states
export type ApiState<T> = {
  data: T | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  error: string | null
}

// Async action state
export type AsyncState = {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  error: string | null
}

// With pagination wrapper
export type WithPagination<T> = {
  items: T[]
  pagination: Pagination
}

// Filter state
export type FilterState<T> = {
  activeFilters: T
  hasActiveFilters: boolean
}

// Status type helper for badges
export type StatusVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

// Branded ID types for type safety (prevents mixing different ID types)
declare const brand: unique symbol
type Brand<T, B> = T & { [brand]: B }

export type UserId = Brand<string, 'UserId'>
export type JobId = Brand<string, 'JobId'>
export type ApplicationId = Brand<string, 'ApplicationId'>
export type CompanyId = Brand<string, 'CompanyId'>

// Color variant type matching design system
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'destructive'
export type ColorShade = 'default' | 'hover' | 'active' | 'light' | 'border'

// Size types matching design system
export type ButtonSize = 'sm' | 'md' | 'lg'
export type IconSize = 16 | 20 | 24 | 32 | 40 | 48
export type InputSize = 'default' | 'large'

// Spacing type (8px grid)
export type Spacing = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12

// Radius type
export type Radius = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
