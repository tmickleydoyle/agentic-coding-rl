import React from "react";
import { useApp } from "./AppStateProvider";
export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-inventory" onClick={() => navigate("inventory")}>Inventory</button>
      <button data-testid="nav-donations" onClick={() => navigate("donations")}>Donations</button>
      <button data-testid="nav-clients" onClick={() => navigate("clients")}>Clients</button>
    </nav>
  );
}
