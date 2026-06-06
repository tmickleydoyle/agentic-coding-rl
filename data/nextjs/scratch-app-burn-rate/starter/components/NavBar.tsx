import React from "react";

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard">Dashboard</button>
      <button data-testid="nav-transactions">Transactions</button>
      <button data-testid="nav-categories">Categories</button>
      <button data-testid="nav-forecast">Forecast</button>
    </nav>
  );
}
