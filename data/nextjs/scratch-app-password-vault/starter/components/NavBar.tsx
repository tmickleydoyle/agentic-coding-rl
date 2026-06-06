import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-vault" onClick={() => navigate("/")}>Vault</button>
      <button data-testid="nav-generate" onClick={() => navigate("/generate")}>Generate</button>
      <button data-testid="nav-audit" onClick={() => navigate("/audit")}>Audit</button>
      <button data-testid="nav-settings" onClick={() => navigate("/settings")}>Settings</button>
    </nav>
  );
}
