'use client'

import React, { useState } from 'react'
import GenericTable, { type ColumnDef } from '@/components/generic/GenericTable'
import GenericFilterButton from '@/components/generic/GenericFilterButton'
import GenericModal, { type FieldDef } from '@/components/generic/GenericModal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const incomeData = [
  {
    voucher: '01',
    customerName: 'Mr. Adnan Tariq',
    accountHead: 'Munem Habib',
    paymentMethod: 'Bank',
    date: '2/24/2023',
    status: 'Invoiced',
    amount: 'Rs. 40,000',
  },
  {
    voucher: '02',
    customerName: 'Mr. Adnan Tariq',
    accountHead: 'Habib Ullah',
    paymentMethod: 'Cash',
    date: '3/24/2023',
    status: 'Invoiced',
    amount: 'Rs. 10,000',
  },
]

const tableColumns: ColumnDef[] = [
  { id: 'voucher', label: 'Voucher#', width: '10%' },
  { id: 'customerName', label: 'Customer Name', width: '18%' },
  { id: 'accountHead', label: 'Account Head', width: '16%' },
  { id: 'paymentMethod', label: 'Payment Method', width: '16%' },
  { id: 'date', label: 'Date', width: '14%' },
  { id: 'status', label: 'Status', width: '12%' },
  { id: 'amount', label: 'Amount', width: '14%' },
]

const modalFields: FieldDef[] = [
  { id: 'customerName', label: 'Customer Name', type: 'text', placeholder: 'Enter customer name', required: true },
  { id: 'accountHead', label: 'Account Head', type: 'text', placeholder: 'Enter account head', required: true },
  { id: 'paymentMethod', label: 'Payment Method', type: 'text', placeholder: 'Enter payment method', required: true },
  { id: 'amount', label: 'Amount', type: 'number', placeholder: 'Enter amount', required: true },
  { id: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter description', rows: 4 },
]

const filterOptions = ['All', 'Invoiced', 'Paid', 'Pending', 'Overdue']

export default function IncomePage() {
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredData = selectedFilter === 'All'
    ? incomeData
    : incomeData.filter((row) => row.status === selectedFilter)

  const handleAddIncome = (formData: Record<string, string>) => {
    console.log('[v0] Adding new income entry:', formData)
    // TODO: Add API call to save the income entry
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-3">
        <GenericFilterButton
          options={filterOptions}
          selectedOption={selectedFilter}
          onOptionChange={setSelectedFilter}
          label="Filter"
        />
        <Button
          className="bg-[#1B0D3F] hover:bg-[#2D1B69] text-white font-semibold text-sm gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Add
        </Button>
      </div>

      <GenericTable
        columns={tableColumns}
        data={filteredData}
        emptyMessage="No income entries found"
      />

      <GenericModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Income Detail"
        fields={modalFields}
        onSubmit={handleAddIncome}
        submitButtonLabel="Save"
        showAddFileButton={true}
      />
    </div>
  )
}
