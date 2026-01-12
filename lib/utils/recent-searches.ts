const STORAGE_KEY = 'horizon-recent-searches'
const MAX_RECENT_SEARCHES = 5
const EXPIRY_DAYS = 30

export interface RecentSearch {
  query: string
  timestamp: string
}

/**
 * Get recent searches from localStorage
 */
export function getRecentSearches(): RecentSearch[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const searches: RecentSearch[] = JSON.parse(stored)

    // Filter out searches older than 30 days
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() - EXPIRY_DAYS)

    const validSearches = searches.filter(
      (search) => new Date(search.timestamp) > expiryDate
    )

    // If we filtered out expired searches, update localStorage
    if (validSearches.length !== searches.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validSearches))
    }

    return validSearches
  } catch (error) {
    console.error('Error reading recent searches:', error)
    return []
  }
}

/**
 * Add search to recent searches
 */
export function addRecentSearch(query: string): void {
  if (typeof window === 'undefined') return

  const trimmedQuery = query.trim()
  if (!trimmedQuery) return

  try {
    const searches = getRecentSearches()

    // Remove duplicate if exists (case-insensitive)
    const filtered = searches.filter(
      (search) => search.query.toLowerCase() !== trimmedQuery.toLowerCase()
    )

    // Add new search at the beginning
    const updated: RecentSearch[] = [
      { query: trimmedQuery, timestamp: new Date().toISOString() },
      ...filtered,
    ].slice(0, MAX_RECENT_SEARCHES) // Keep only max items

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Error saving recent search:', error)
  }
}

/**
 * Remove specific search from recent searches
 */
export function removeRecentSearch(query: string): void {
  if (typeof window === 'undefined') return

  try {
    const searches = getRecentSearches()
    const updated = searches.filter(
      (search) => search.query.toLowerCase() !== query.toLowerCase()
    )

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Error removing recent search:', error)
  }
}

/**
 * Clear all recent searches
 */
export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing recent searches:', error)
  }
}
