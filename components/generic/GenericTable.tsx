'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export interface ColumnDef {
  id: string
  label: string
  width?: string
  render?: (value: any) => React.ReactNode
}

export interface GenericTableProps {
  columns: ColumnDef[]
  data: Record<string, any>[]
  emptyMessage?: string
  onRowClick?: (row: Record<string, any>) => void
  rowClassName?: (index: number) => string
}

export default function GenericTable({
  columns,
  data,
  emptyMessage = 'No entries found',
  onRowClick,
  rowClassName,
}: GenericTableProps) {
  return (
    <div className="rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#1B0D3F] hover:bg-[#1B0D3F]">
            {columns.map((col) => (
              <TableHead
                key={col.id}
                style={{ width: col.width }}
                className="text-white font-semibold text-sm py-3 px-4"
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-8 text-gray-500"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={index}
                className={`
                  ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                  hover:bg-[#EEEDF2] cursor-pointer transition-colors
                  border-b border-gray-200
                  ${rowClassName ? rowClassName(index) : ''}
                `}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <TableCell
                    key={`${index}-${col.id}`}
                    style={{ width: col.width }}
                    className="py-3 px-4 text-sm text-gray-800"
                  >
                    {col.render ? col.render(row[col.id]) : row[col.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
