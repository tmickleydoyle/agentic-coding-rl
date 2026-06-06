import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard" onClick={() => navigate({ name: "dashboard" })}>Dashboard</button>
      <button data-testid="nav-trail" onClick={() => navigate({ name: "trail" })}>Audit Trail</button>
    </nav>
  );
}
