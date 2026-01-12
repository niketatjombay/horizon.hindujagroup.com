import { getMockCHRODashboard, type TimeRange, type CHRODashboardData } from '@/mock'

/**
 * Fetch CHRO dashboard data for a given time range
 */
export async function fetchCHRODashboard(timeRange: TimeRange): Promise<CHRODashboardData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return getMockCHRODashboard(timeRange)
}

// Re-export types for convenience
export type { TimeRange, CHRODashboardData }
