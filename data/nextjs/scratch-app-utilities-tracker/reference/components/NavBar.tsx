import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { route, navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard" onClick={() => navigate("/")} aria-current={route === "/" ? "page" : undefined}>Dashboard</button>
      <button data-testid="nav-utilities" onClick={() => navigate("/utilities")} aria-current={route === "/utilities" ? "page" : undefined}>Utilities</button>
      <button data-testid="nav-bills" onClick={() => navigate("/bills")} aria-current={route === "/bills" ? "page" : undefined}>Bills</button>
      <button data-testid="nav-usage" onClick={() => navigate("/usage")} aria-current={route === "/usage" ? "page" : undefined}>Usage</button>
      <button data-testid="nav-reports" onClick={() => navigate("/reports")} aria-current={route === "/reports" ? "page" : undefined}>Reports</button>
    </nav>
  );
}
