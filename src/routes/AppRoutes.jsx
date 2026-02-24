// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import TabContent from "../components/layout/TabContent";

import CustomersPage from "../components/pages/create/CustomersPage";
import VendorsPage from "../components/pages/create/VendorsPage";
import ProjectsPage from "../components/pages/create/ProjectsPage";
import EmployeesPage from "../components/pages/create/EmployeesPage";
import ProfitPage from "../components/pages/report/ProfitPage";
import CashInOutPage from "../components/pages/report/CashInOutPage";
import LedgerPage from "../components/pages/report/LedgerPage";
import PageNotFound from "../components/pages/PageNotFound";

import DashboardPage from "@/components/dashboard/DashboardPage";
import IncomePage from "@/components/pages/income/IncomePage";
import ExpensePage from "@/components/pages/expense/ExpensePage";
import InvoicesPage from "@/components/pages/invoices/InvoicesPage";
import CashbookPage from "@/components/pages/cashbook/CashbookPage";
import PlaceholderPage from "@/components/pages/MaintenancePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Redirect root to a default tab (dashboard) */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Parent route that renders hero tabs + an Outlet for nested tab pages */}
        <Route element={<TabContent />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="income" element={<IncomePage />} />
          <Route path="expense" element={<ExpensePage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="cashbook" element={<CashbookPage />} />
          {/* fallback placeholder route for other tabs you might have */}
          <Route path=":other" element={<PlaceholderPage />} />
        </Route>

        {/* Other top-level routes (create/report pages) remain siblings */}
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="vendors" element={<VendorsPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="profit" element={<ProfitPage />} />
        <Route path="cash-in-out" element={<CashInOutPage />} />
        <Route path="ledger" element={<LedgerPage />} />

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}
