import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

import Customers from "../components/pages/create/CustomersPage";
import Vendors from "../components/pages/create/Venders";
import Projects from "../components/pages/create/ProjectsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Projects />} />
        <Route path="projects" element={<Projects />} />
        <Route path="customers" element={<Customers />} />
        <Route path="vendors" element={<Vendors />} />
      </Route>
    </Routes>
  );
}
