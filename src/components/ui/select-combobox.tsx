/**
 * SelectCombobox - Searchable select with grouping and badges
 *
 * Generic component for 13+ items with:
 * - Type-ahead search
 * - Grouping support
 * - Badge rendering
 * - Popular items first
 * - Keyboard navigation
 */

'use client'

import { useState, useMemo, useId } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface SelectComboboxProps<T> {
  options: T[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean

  // Value extraction
  getOptionValue: (option: T) => string
  getOptionLabel: (option: T) => string
  getOptionKeywords: (option: T) => string[]

  // Customization
  groupBy?: (option: T) => string
  renderGroupHeader?: (group: string) => React.ReactNode
  renderOption?: (option: T) => React.ReactNode
  getBadge?: (option: T) => React.ReactNode | null
  popularItems?: string[] // values to show first

  // i18n
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
}

export function SelectCombobox<T>({
  options,
  value,
  onChange,
  disabled,
  getOptionValue,
  getOptionLabel,
  getOptionKeywords,
  groupBy,
  renderGroupHeader,
  renderOption,
  getBadge,
  popularItems = [],
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results',
}: SelectComboboxProps<T>) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const listboxId = useId()

  // Filter by search
  const filteredOptions = useMemo(() => {
    if (!search) return options

    const query = search.toLowerCase()
    return options.filter((option) => {
      const keywords = getOptionKeywords(option)
      return keywords.some((kw) => kw.toLowerCase().includes(query))
    })
  }, [options, search, getOptionKeywords])

  // Sort: popular first, then rest
  const sortedOptions = useMemo(() => {
    if (!popularItems.length) return filteredOptions

    const popular = filteredOptions.filter((opt) =>
      popularItems.includes(getOptionValue(opt))
    )
    const rest = filteredOptions.filter((opt) =>
      !popularItems.includes(getOptionValue(opt))
    )

    return [...popular, ...rest]
  }, [filteredOptions, popularItems, getOptionValue])

  // Group options
  const grouped = useMemo(() => {
    if (!groupBy) return { '': sortedOptions }

    return sortedOptions.reduce((acc, opt) => {
      const group = groupBy(opt)
      if (!acc[group]) acc[group] = []
      acc[group].push(opt)
      return acc
    }, {} as Record<string, T[]>)
  }, [sortedOptions, groupBy])

  const selectedOption = options.find((opt) => getOptionValue(opt) === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between rounded-md border border-[var(--border-default)] bg-[var(--surface-1)] px-3 py-2 text-sm",
            "hover:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className={cn(!selectedOption && "text-[var(--text-tertiary)]")}>
            {selectedOption ? getOptionLabel(selectedOption) : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command id={listboxId} shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>{emptyMessage}</CommandEmpty>

          {Object.entries(grouped).map(([group, groupOptions]) => (
            <CommandGroup key={group} heading={group && renderGroupHeader?.(group)}>
              {groupOptions.map((option) => {
                const optionValue = getOptionValue(option)
                const isSelected = value === optionValue
                const badge = getBadge?.(option)

                return (
                  <CommandItem
                    key={optionValue}
                    value={optionValue}
                    onSelect={() => {
                      onChange(optionValue)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                    <div className="flex items-center justify-between flex-1">
                      {renderOption?.(option) ?? getOptionLabel(option)}
                      {badge}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          ))}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
