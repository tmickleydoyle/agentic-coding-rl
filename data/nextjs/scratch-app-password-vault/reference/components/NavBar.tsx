import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { route, navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-vault" onClick={() => navigate("/")} aria-current={route === "/" ? "page" : undefined}>Vault</button>
      <button data-testid="nav-generate" onClick={() => navigate("/generate")} aria-current={route === "/generate" ? "page" : undefined}>Generate</button>
      <button data-testid="nav-audit" onClick={() => navigate("/audit")} aria-current={route === "/audit" ? "page" : undefined}>Audit</button>
      <button data-testid="nav-settings" onClick={() => navigate("/settings")} aria-current={route === "/settings" ? "page" : undefined}>Settings</button>
    </nav>
  );
}
