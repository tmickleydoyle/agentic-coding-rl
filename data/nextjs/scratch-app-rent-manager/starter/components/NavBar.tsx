import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard" onClick={() => navigate("/")}>Dashboard</button>
      <button data-testid="nav-tenants" onClick={() => navigate("/tenants")}>Tenants</button>
      <button data-testid="nav-payments" onClick={() => navigate("/payments")}>Payments</button>
      <button data-testid="nav-settings" onClick={() => navigate("/settings")}>Settings</button>
    </nav>
  );
}
