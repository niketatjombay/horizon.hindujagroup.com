'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, useEffect } from 'react'
import { initializeDataStore } from '@/mock'

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize localStorage data store on mount
  useEffect(() => {
    initializeDataStore()
  }, [])

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: 5 minutes (data considered fresh for 5 min)
            staleTime: 5 * 60 * 1000,
            // Cache time: 10 minutes (keep in memory for 10 min)
            gcTime: 10 * 60 * 1000,
            // Refetch on window focus
            refetchOnWindowFocus: true,
            // Retry failed requests 3 times with exponential backoff
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // Retry mutations once
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
