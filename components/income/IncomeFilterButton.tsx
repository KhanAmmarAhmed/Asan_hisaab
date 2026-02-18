'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, Filter } from 'lucide-react'

interface IncomeFilterButtonProps {
  selectedFilter: string
  onFilterChange: (filter: string) => void
  filterOptions: string[]
}

export default function IncomeFilterButton({
  selectedFilter,
  onFilterChange,
  filterOptions,
}: IncomeFilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="default"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#1B0D3F] hover:bg-[#2D1B69] text-white font-semibold text-sm gap-2"
      >
        <Filter size={18} />
        {selectedFilter !== 'All' && selectedFilter}
        <ChevronDown size={16} />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => {
                onFilterChange(option)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                option === selectedFilter ? 'bg-gray-50 font-semibold text-[#1B0D3F]' : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
