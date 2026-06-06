import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard" onClick={() => navigate("/")}>Dashboard</button>
      <button data-testid="nav-assets" onClick={() => navigate("/assets")}>Assets</button>
      <button data-testid="nav-beneficiaries" onClick={() => navigate("/beneficiaries")}>Beneficiaries</button>
      <button data-testid="nav-notes" onClick={() => navigate("/notes")}>Notes</button>
    </nav>
  );
}
