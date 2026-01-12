import { useQuery } from '@tanstack/react-query'
import { fetchCHRODashboard, type TimeRange, type CHRODashboardData } from '@/lib/api/chro'

/**
 * Hook to fetch CHRO dashboard data
 */
export function useCHRODashboard(timeRange: TimeRange) {
  return useQuery({
    queryKey: ['chro-dashboard', timeRange],
    queryFn: () => fetchCHRODashboard(timeRange),
  })
}

// Re-export types
export type { TimeRange, CHRODashboardData }
