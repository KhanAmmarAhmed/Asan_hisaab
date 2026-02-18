import React from 'react'
import Box from '@mui/material/Box'
import BalanceCards from './BalanceCards'
import ExpenseSection from './ExpenseSection'
import SummaryChart from './SummaryChart'

export default function DashboardPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <BalanceCards />
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <ExpenseSection />
        <SummaryChart />
      </Box>
    </Box>
  )
}
