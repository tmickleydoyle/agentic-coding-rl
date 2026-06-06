import React from "react";

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-log">Log Sleep</button>
      <button data-testid="nav-history">History</button>
      <button data-testid="nav-insights">Insights</button>
    </nav>
  );
}
