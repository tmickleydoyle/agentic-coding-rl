import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard" onClick={() => navigate({ name: "dashboard" })}>Dashboard</button>
      <button data-testid="nav-signoffs" onClick={() => navigate({ name: "list" })}>Sign-offs</button>
    </nav>
  );
}
