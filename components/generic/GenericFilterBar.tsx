'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Filter, Search, Plus } from 'lucide-react'

export interface FilterOption {
  id: string
  label: string
  type: 'dropdown' | 'search' | 'date'
  options?: string[]
  placeholder?: string
}

export interface GenericFilterBarProps {
  filters: FilterOption[]
  onFilterChange: (filterId: string, value: string) => void
  onAddClick?: () => void
  showAddButton?: boolean
  addButtonLabel?: string
}

export default function GenericFilterBar({
  filters,
  onFilterChange,
  onAddClick,
  showAddButton = true,
  addButtonLabel = 'Add',
}: GenericFilterBarProps) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})

  const handleFilterChange = (filterId: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [filterId]: value }))
    onFilterChange(filterId, value)
  }

  return (
    <div className="flex flex-wrap gap-3 items-center mb-4">
      {filters.map((filter) => {
        if (filter.type === 'dropdown') {
          return (
            <Select
              key={filter.id}
              value={filterValues[filter.id] || ''}
              onValueChange={(value) => handleFilterChange(filter.id, value)}
            >
              <SelectTrigger className="w-48 border border-gray-300 rounded-lg">
                <SelectValue placeholder={filter.placeholder || filter.label} />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }

        if (filter.type === 'search') {
          return (
            <Input
              key={filter.id}
              type="text"
              placeholder={filter.placeholder || filter.label}
              value={filterValues[filter.id] || ''}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              className="w-48 border border-gray-300 rounded-lg"
            />
          )
        }

        if (filter.type === 'date') {
          return (
            <Input
              key={filter.id}
              type="date"
              value={filterValues[filter.id] || ''}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              className="w-48 border border-gray-300 rounded-lg"
            />
          )
        }

        return null
      })}

      {showAddButton && (
        <Button
          onClick={onAddClick}
          className="bg-[#1B0D3F] hover:bg-[#2D1B69] text-white font-semibold gap-2 ml-auto"
        >
          <Plus size={18} />
          {addButtonLabel}
        </Button>
      )}
    </div>
  )
}
