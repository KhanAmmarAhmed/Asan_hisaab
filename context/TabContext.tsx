"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type TabKey =
  | "dashboard"
  | "income"
  | "expense"
  | "invoices"
  | "cashbook"
  | "report";

interface TabContextType {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTabState] = useState<TabKey>("dashboard");

  const setActiveTab = useCallback((tab: TabKey) => {
    setActiveTabState(tab);
  }, []);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTab() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTab must be used within a TabProvider");
  }
  return context;
}
