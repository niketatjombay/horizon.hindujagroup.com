'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Clock, Loader2 } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { useJobs } from '@/lib/hooks/use-jobs'
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  type RecentSearch,
} from '@/lib/utils/recent-searches'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
  autoFocus?: boolean
  expandOnFocus?: boolean
}

export function SearchBar({
  placeholder = 'Search jobs...',
  className,
  onSearch,
  autoFocus = false,
  expandOnFocus = true,
}: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debounce search query
  const debouncedQuery = useDebounce(query, 300)

  // Fetch suggestions based on debounced query
  const { data: jobsData, isLoading } = useJobs(
    debouncedQuery.trim() ? { search: debouncedQuery, pageSize: 5 } : undefined
  )

  const suggestions = jobsData?.data || []

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // Show dropdown when focused and has content
  useEffect(() => {
    setShowDropdown(
      isFocused && (query.length > 0 || recentSearches.length > 0)
    )
  }, [isFocused, query, recentSearches])

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [suggestions, recentSearches, query])

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = useCallback(
    (searchQuery: string) => {
      const trimmedQuery = searchQuery.trim()

      if (!trimmedQuery) return

      // Add to recent searches
      addRecentSearch(trimmedQuery)
      setRecentSearches(getRecentSearches())

      // Close dropdown
      setShowDropdown(false)
      setIsFocused(false)

      // Call callback or navigate
      if (onSearch) {
        onSearch(trimmedQuery)
      } else {
        router.push(`/jobs?search=${encodeURIComponent(trimmedQuery)}`)
      }

      // Clear input
      setQuery('')
    },
    [onSearch, router]
  )

  const handleSuggestionClick = (jobTitle: string) => {
    handleSearch(jobTitle)
  }

  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery)
    handleSearch(searchQuery)
  }

  const handleRemoveRecent = (searchQuery: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeRecentSearch(searchQuery)
    setRecentSearches(getRecentSearches())
  }

  const handleClear = () => {
    setQuery('')
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowDropdown(false)
      setIsFocused(false)
      inputRef.current?.blur()
      return
    }

    // Build list of all selectable items
    const recentItems = !query ? recentSearches.map((s) => s.query) : []
    const suggestionItems = query && !isLoading ? suggestions.map((s) => s.title) : []
    const allItems = [...recentItems, ...suggestionItems]

    if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < allItems.length) {
        // Select highlighted item
        handleSearch(allItems[selectedIndex])
      } else if (query.trim()) {
        // Submit current query
        handleSearch(query)
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < allItems.length - 1 ? prev + 1 : prev
      )
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    }
  }

  return (
    <div className={cn('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-600 pointer-events-none" />

        <input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            'h-10 rounded-full border-0 bg-gray-50 pl-10 pr-10 text-base outline-none transition-all duration-300',
            'placeholder:text-gray-500',
            isFocused && 'bg-white ring-2 ring-primary/20 border border-primary',
            expandOnFocus && isFocused ? 'w-[480px]' : 'w-80'
          )}
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 transition-colors hover:text-destructive"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-gray-300 bg-white shadow-2"
        >
          <div className="max-h-96 overflow-y-auto p-2">
            {/* Loading State */}
            {isLoading && query.trim() && (
              <div className="flex items-center justify-center gap-3 py-8">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-gray-600">
                  Searching...
                </span>
              </div>
            )}

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={search.query}
                    onClick={() => handleRecentSearchClick(search.query)}
                    className={cn(
                      'group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors',
                      selectedIndex === index
                        ? 'bg-primary/10'
                        : 'hover:bg-gray-50'
                    )}
                    type="button"
                  >
                    <Clock className="h-4 w-4 flex-shrink-0 text-gray-600" />
                    <span className="flex-1 truncate text-sm font-medium">
                      {search.query}
                    </span>
                    <button
                      onClick={(e) => handleRemoveRecent(search.query, e)}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      type="button"
                    >
                      <X className="h-4 w-4 text-gray-500 hover:text-destructive" />
                    </button>
                  </button>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {query && !isLoading && suggestions.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Suggestions
                </div>
                {suggestions.map((job, index) => (
                  <button
                    key={job.id}
                    onClick={() => handleSuggestionClick(job.title)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors',
                      selectedIndex === index
                        ? 'bg-primary/10'
                        : 'hover:bg-gray-50'
                    )}
                    type="button"
                  >
                    <Search className="h-4 w-4 flex-shrink-0 text-gray-600" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-gray-900">
                        {job.title}
                      </div>
                      <div className="truncate text-xs text-gray-600">
                        {job.companyName}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {query && !isLoading && suggestions.length === 0 && (
              <div className="flex flex-col items-center py-12 text-center">
                <Search className="mb-4 h-12 w-12 text-gray-400" />
                <h4 className="mb-2 text-lg font-semibold text-gray-900">
                  No results found
                </h4>
                <p className="text-sm text-gray-600">
                  Try adjusting your search terms
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
