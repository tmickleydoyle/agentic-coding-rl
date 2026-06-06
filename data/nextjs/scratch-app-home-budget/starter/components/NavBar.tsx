import React from "react";

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-expenses">Expenses</button>
      <button data-testid="nav-income">Income</button>
      <button data-testid="nav-reports">Reports</button>
    </nav>
  );
}
