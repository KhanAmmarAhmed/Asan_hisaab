'use client'

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface IncomeEntry {
  voucher: string
  customerName: string
  accountHead: string
  paymentMethod: string
  date: string
  status: string
  amount: string
}

interface IncomeTableProps {
  data: IncomeEntry[]
}

const columns = [
  { id: 'voucher', label: 'Voucher#', width: '10%' },
  { id: 'customerName', label: 'Customer Name', width: '18%' },
  { id: 'accountHead', label: 'Account Head', width: '16%' },
  { id: 'paymentMethod', label: 'Payment Method', width: '16%' },
  { id: 'date', label: 'Date', width: '14%' },
  { id: 'status', label: 'Status', width: '12%' },
  { id: 'amount', label: 'Amount', width: '14%' },
]

export default function IncomeTable({ data }: IncomeTableProps) {
  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#1B0D3F] hover:bg-[#1B0D3F]">
            {columns.map((col) => (
              <TableHead
                key={col.id}
                className="text-white font-semibold text-sm"
                style={{ width: col.width }}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <TableRow
                key={row.voucher}
                className={index % 2 === 0 ? 'bg-[#F5F5F5]' : 'bg-white'}
              >
                <TableCell className="text-sm">{row.voucher}</TableCell>
                <TableCell className="text-sm">{row.customerName}</TableCell>
                <TableCell className="text-sm">{row.accountHead}</TableCell>
                <TableCell className="text-sm">{row.paymentMethod}</TableCell>
                <TableCell className="text-sm">{row.date}</TableCell>
                <TableCell className="text-sm">{row.status}</TableCell>
                <TableCell className="text-sm font-semibold">{row.amount}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                No income entries found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
