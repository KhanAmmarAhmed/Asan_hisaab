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
import { Filter, ChevronDown } from 'lucide-react'

export interface GenericFilterButtonProps {
  options: string[]
  selectedOption: string
  onOptionChange: (option: string) => void
  label?: string
}

export default function GenericFilterButton({
  options,
  selectedOption,
  onOptionChange,
  label = 'Filter',
}: GenericFilterButtonProps) {
  return (
    <Select value={selectedOption} onValueChange={onOptionChange}>
      <SelectTrigger className="w-auto bg-[#1B0D3F] text-white border-0 hover:bg-[#2D1B69]">
        <Filter size={18} className="mr-2" />
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
