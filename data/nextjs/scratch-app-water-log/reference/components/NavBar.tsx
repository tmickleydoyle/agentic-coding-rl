import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav>
      <button data-testid="nav-dashboard" onClick={() => navigate("dashboard")}>Dashboard</button>
      <button data-testid="nav-log-water" onClick={() => navigate("log-water")}>Log Water</button>
      <button data-testid="nav-history" onClick={() => navigate("history")}>History</button>
    </nav>
  );
}
