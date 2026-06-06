import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-profiles" onClick={() => navigate("/")}>Profiles</button>
      <button data-testid="nav-allocations" onClick={() => navigate("/allocations")}>Allocations</button>
      <button data-testid="nav-report" onClick={() => navigate("/report")}>Report</button>
    </nav>
  );
}
