'use client'

import { useState, useMemo } from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface Option {
  id: string
  name: string
}

interface MultiSelectFilterProps {
  label: string
  placeholder: string
  options: Option[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  maxSelections?: number
  showSelectAll?: boolean
  searchable?: boolean
  className?: string
}

export function MultiSelectFilter({
  label,
  placeholder,
  options,
  selectedIds,
  onChange,
  maxSelections,
  showSelectAll = true,
  searchable = true,
  className,
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  // Filter options by search
  const filteredOptions = useMemo(() => {
    if (!search) return options
    const lowerSearch = search.toLowerCase()
    return options.filter((opt) =>
      opt.name.toLowerCase().includes(lowerSearch)
    )
  }, [options, search])

  // Get display text
  const displayText = useMemo(() => {
    if (selectedIds.length === 0) return placeholder
    if (selectedIds.length === options.length) return 'All selected'
    if (selectedIds.length === 1) {
      const selected = options.find((o) => o.id === selectedIds[0])
      return selected?.name || '1 selected'
    }
    return `${selectedIds.length} selected`
  }, [selectedIds, options, placeholder])

  const isAllSelected = selectedIds.length === options.length
  const isPartiallySelected =
    selectedIds.length > 0 && selectedIds.length < options.length

  const handleSelectAll = () => {
    if (isAllSelected) {
      onChange([])
    } else {
      const allIds = options.map((o) => o.id)
      if (maxSelections && allIds.length > maxSelections) {
        onChange(allIds.slice(0, maxSelections))
      } else {
        onChange(allIds)
      }
    }
  }

  const handleToggle = (id: string) => {
    const isSelected = selectedIds.includes(id)
    if (isSelected) {
      onChange(selectedIds.filter((sid) => sid !== id))
    } else {
      if (maxSelections && selectedIds.length >= maxSelections) {
        // Replace the last selection
        onChange([...selectedIds.slice(0, -1), id])
      } else {
        onChange([...selectedIds, id])
      }
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([])
  }

  return (
    <div className={className}>
      <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal border border-input bg-background hover:bg-accent"
          >
            <span className="truncate">{displayText}</span>
            <div className="flex items-center gap-1 ml-2">
              {selectedIds.length > 0 && (
                <span
                  onClick={handleClear}
                  className="rounded-full p-0.5 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-3 w-3 text-gray-400" />
                </span>
              )}
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          {/* Search */}
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8"
                />
              </div>
            </div>
          )}

          {/* Select All */}
          {showSelectAll && !maxSelections && (
            <div className="p-2 border-b border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded p-1 -m-1">
                <Checkbox
                  checked={isAllSelected || (isPartiallySelected ? "indeterminate" : false)}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">Select All</span>
              </label>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-[240px] overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No options found
              </p>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedIds.includes(option.id)
                return (
                  <label
                    key={option.id}
                    className={cn(
                      'flex items-center gap-2 cursor-pointer rounded px-2 py-1.5 transition-colors',
                      isSelected
                        ? 'bg-primary/5 text-primary'
                        : 'hover:bg-gray-50'
                    )}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(option.id)}
                    />
                    <span className="text-sm truncate">{option.name}</span>
                  </label>
                )
              })
            )}
          </div>

          {/* Footer with count */}
          {selectedIds.length > 0 && (
            <div className="p-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {selectedIds.length} of {options.length} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange([])}
                className="h-6 text-xs"
              >
                Clear
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
