import React from "react";

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-overview">Overview</button>
      <button data-testid="nav-metrics">Metrics</button>
      <button data-testid="nav-goals">Goals</button>
      <button data-testid="nav-history">History</button>
    </nav>
  );
}
