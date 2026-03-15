// src/components/layout/TabContent.jsx
import { Outlet, NavLink } from "react-router-dom";
// optional: import/use TabContext if you want to keep local context in sync
import { useEffect } from "react";
import { useTab } from "@/context/TabContext"; // optional

export default function TabContent() {
  const { setActiveTab } = useTab?.() || {}; // optional safe access

  // If you keep TabContext, sync it from the path when the route changes.
  // (React Router's useLocation can be used too — omitted here for brevity.)
  useEffect(() => {
    // You can also use useLocation and update setActiveTab based on pathname
    // if you want the context to reflect the route. This is optional.
  }, [setActiveTab]);

  return (
    <div>
      {/* HERO / Tabs UI */}
      <nav className="hero-tabs">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "tab active" : "tab")}
        ></NavLink>
        <NavLink
          to="/income"
          className={({ isActive }) => (isActive ? "tab active" : "tab")}
        ></NavLink>
        <NavLink
          to="/expense"
          className={({ isActive }) => (isActive ? "tab active" : "tab")}
        ></NavLink>
        <NavLink
          to="/invoices"
          className={({ isActive }) => (isActive ? "tab active" : "tab")}
        ></NavLink>
        <NavLink
          to="/cashbook"
          className={({ isActive }) => (isActive ? "tab active" : "tab")}
        ></NavLink>
        {/* ... other tabs */}
      </nav>

      {/* the nested route content renders here */}
      <div className="tab-content">
        <Outlet />
      </div>
    </div>
  );
}
