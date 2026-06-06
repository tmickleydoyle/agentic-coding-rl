import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard" onClick={() => navigate("/")}>Dashboard</button>
      <button data-testid="nav-expenses" onClick={() => navigate("/expenses")}>Expenses</button>
      <button data-testid="nav-roommates" onClick={() => navigate("/roommates")}>Roommates</button>
      <button data-testid="nav-settle" onClick={() => navigate("/settle")}>Settle Up</button>
      <button data-testid="nav-history" onClick={() => navigate("/history")}>History</button>
    </nav>
  );
}
