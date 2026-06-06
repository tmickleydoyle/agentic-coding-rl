import React from "react";
export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-summary">Summary</button>
      <button data-testid="nav-assets">Assets</button>
      <button data-testid="nav-liabilities">Liabilities</button>
      <button data-testid="nav-history">History</button>
    </nav>
  );
}
