import React, { createContext, useContext, useState, useCallback } from 'react'

const TabContext = createContext(undefined)

export function TabProvider({ children }) {
  const [activeTab, setActiveTabState] = useState('dashboard')

  const setActiveTab = useCallback((tab) => {
    setActiveTabState(tab)
  }, [])

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  )
}

export function useTab() {
  const context = useContext(TabContext)
  if (!context) {
    throw new Error('useTab must be used within a TabProvider')
  }
  return context
}
