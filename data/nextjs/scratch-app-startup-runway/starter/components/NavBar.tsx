import React from "react";

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard">Dashboard</button>
      <button data-testid="nav-runway">Runway</button>
      <button data-testid="nav-expenses">Expenses</button>
      <button data-testid="nav-projections">Projections</button>
      <button data-testid="nav-settings">Settings</button>
    </nav>
  );
}
