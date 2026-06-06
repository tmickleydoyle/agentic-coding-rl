import React from "react";
export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-overview">Overview</button>
      <button data-testid="nav-debts">Debts</button>
      <button data-testid="nav-payments">Payments</button>
      <button data-testid="nav-strategy">Strategy</button>
    </nav>
  );
}
