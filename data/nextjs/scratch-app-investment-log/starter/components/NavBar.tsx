import React from "react";
export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-portfolio">Portfolio</button>
      <button data-testid="nav-holdings">Holdings</button>
      <button data-testid="nav-transactions">Transactions</button>
      <button data-testid="nav-performance">Performance</button>
    </nav>
  );
}
