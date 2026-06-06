import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard" onClick={() => navigate("/")}>Dashboard</button>
      <button data-testid="nav-utilities" onClick={() => navigate("/utilities")}>Utilities</button>
      <button data-testid="nav-bills" onClick={() => navigate("/bills")}>Bills</button>
      <button data-testid="nav-usage" onClick={() => navigate("/usage")}>Usage</button>
      <button data-testid="nav-reports" onClick={() => navigate("/reports")}>Reports</button>
    </nav>
  );
}
