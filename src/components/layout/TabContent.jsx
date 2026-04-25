// src/components/layout/TabContent.jsx
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function TabContent() {
  const location = useLocation();

  // Scroll to top when navigating between tabs
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="tab-content">
      <Outlet />
    </div>
  );
}
