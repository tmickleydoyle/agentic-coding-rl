import React from "react";

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard">Dashboard</button>
      <button data-testid="nav-investors">Investors</button>
      <button data-testid="nav-interactions">Interactions</button>
      <button data-testid="nav-pipeline">Pipeline</button>
    </nav>
  );
}
