
import { useTab } from "@/context/TabContext";
import DashboardPage from "@/components/dashboard/DashboardPage";
import IncomePage from "@/components/income/IncomePage";
import PlaceholderPage from "@/components/pages/MaintenancePage";
import ExpensePage from "@/components/expense/ExpensePage";
import InvoicesPage from "@/components/invoices/InvoicesPage";
import CashbookPage from "@/components/cashbook/CashbookPage";


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
  if (activeTab === "report") {
    return <CashbookPage />;
  }

  const config = pageConfig[activeTab];

  return (
    <PlaceholderPage title={config.title} description={config.description} />
  );
}
