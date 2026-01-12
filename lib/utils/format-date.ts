import { differenceInDays, isToday, isYesterday, parseISO } from 'date-fns'

/**
 * Formats a date string into a human-readable "Posted X days ago" format
 */
export function formatPostedDate(dateString: string): string {
  const date = parseISO(dateString)

  if (isToday(date)) {
    return 'Posted today'
  }

  if (isYesterday(date)) {
    return 'Posted yesterday'
  }

  const daysAgo = differenceInDays(new Date(), date)

  if (daysAgo < 7) {
    return `Posted ${daysAgo} days ago`
  }

  if (daysAgo < 14) {
    return 'Posted 1 week ago'
  }

  if (daysAgo < 30) {
    const weeks = Math.floor(daysAgo / 7)
    return `Posted ${weeks} weeks ago`
  }

  const months = Math.floor(daysAgo / 30)
  if (months === 1) {
    return 'Posted 1 month ago'
  }

  return `Posted ${months} months ago`
}
