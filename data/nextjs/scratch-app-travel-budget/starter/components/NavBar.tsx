import React from "react";

export default function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-expenses">Expenses</button>
      <button data-testid="nav-add-expense">Add Expense</button>
      <button data-testid="nav-summary">Summary</button>
    </nav>
  );
}
