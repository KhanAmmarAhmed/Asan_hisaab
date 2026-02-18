"use client";

import React from "react";
import { useTab } from "@/context/TabContext";
import DashboardPage from "@/components/dashboard/DashboardPage";
import IncomePage from "@/components/income/IncomePage";
import PlaceholderPage from "@/components/pages/PlaceholderPage";

const pageConfig = {
  income: {
    title: "Income",
    description:
      "Track and manage all your income entries. Add new income records, categorize them, and monitor your cash flow.",
  },
  expense: {
    title: "Expense",
    description:
      "Record and categorize your expenses. Keep track of daily, weekly, monthly, and yearly spending patterns.",
  },
  invoices: {
    title: "Invoices",
    description:
      "Create, send, and manage invoices. Track payment status and maintain a record of all your business invoices.",
  },
  cashbook: {
    title: "Cashbook",
    description:
      "Maintain a detailed cashbook with all your transactions. View running balances and reconcile your accounts.",
  },
  report: {
    title: "Reports",
    description:
      "Generate comprehensive financial reports. Analyze your income, expenses, and overall business performance.",
  },
} as const;

export default function TabContent() {
  const { activeTab } = useTab();

  if (activeTab === "dashboard") {
    return <DashboardPage />;
  }

  if (activeTab === "income") {
    return <IncomePage />;
  }

  const config = pageConfig[activeTab as keyof typeof pageConfig];

  return <PlaceholderPage title={config.title} description={config.description} />;
}
