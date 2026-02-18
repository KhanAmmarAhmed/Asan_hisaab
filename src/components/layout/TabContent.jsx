import React from "react";
import { useTab } from "@/context/TabContext";
import DashboardPage from "@/components/dashboard/DashboardPage";
import IncomePage from "@/components/income/IncomePage";
import PlaceholderPage from "@/components/pages/MaintenancePage";
import ExpensePage from "@/components/expense/ExpensePage";
import InvoicesPage from "@/components/invoices/InvoicesPage";
import CashbookPage from "@/components/cashbook/CashbookPage";

const pageConfig = {
  report: {
    title: "Reports",
    description:
      "Generate comprehensive financial reports. Analyze your income, expenses, and overall business performance.",
  },
};

export default function TabContent() {
  const { activeTab } = useTab();

  if (activeTab === "dashboard") {
    return <DashboardPage />;
  }

  if (activeTab === "income") {
    return <IncomePage />;
  }
  if (activeTab === "expense") {
    return <ExpensePage />;
  }
  if (activeTab === "invoices") {
    return <InvoicesPage />;
  }
  if (activeTab === "cashbook") {
    return <CashbookPage />;
  }

  const config = pageConfig[activeTab];

  return (
    <PlaceholderPage title={config.title} description={config.description} />
  );
}
