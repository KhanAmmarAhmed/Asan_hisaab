import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import TabContent from "../components/layout/TabContent";

import CustomersPage from "../components/pages/create/CustomersPage";
import VendorsPage from "../components/pages/create/Venders";
import ProjectsPage from "../components/pages/create/ProjectsPage";
import EmployeesPage from "../components/pages/create/EmployeesPage";
import ProfitPage from "../components/pages/report/ProfitPage";
import CashInOutPage from "../components/pages/report/CashInOutPage";
import LedgerPage from "../components/pages/report/LedgerPage";
import PageNotFound from "../components/pages/PageNotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Index route renders TabContent — this keeps HeroSection tabs working */}
        <Route index element={<TabContent />} />
        {/* Create dropdown routes */}
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
