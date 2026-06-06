import React from "react";

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard">Dashboard</button>
      <button data-testid="nav-shareholders">Shareholders</button>
      <button data-testid="nav-rounds">Rounds</button>
      <button data-testid="nav-dilution">Dilution</button>
    </nav>
  );
}
