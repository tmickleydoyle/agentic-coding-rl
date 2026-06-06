import React from "react";
import { useApp } from "./AppStateProvider";

export default function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button onClick={() => navigate("/")} data-testid="nav-home">Home</button>
      <button onClick={() => navigate("/expenses")} data-testid="nav-expenses">Expenses</button>
      <button onClick={() => navigate("/add-expense")} data-testid="nav-add-expense">Add Expense</button>
      <button onClick={() => navigate("/summary")} data-testid="nav-summary">Summary</button>
    </nav>
  );
}
