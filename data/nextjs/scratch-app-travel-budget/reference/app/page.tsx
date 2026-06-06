import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import NavBar from "../components/NavBar";
import ExpensesPage from "./expenses/page";
import AddExpensePage from "./add-expense/page";
import SummaryPage from "./summary/page";

function Shell() {
  const { route, expenses, budget } = useApp();
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = budget.totalBudget - totalSpent;
  const percentUsed = ((totalSpent / budget.totalBudget) * 100).toFixed(1) + "%";

  let content: React.ReactNode;
  if (route === "/expenses") content = <ExpensesPage />;
  else if (route === "/add-expense") content = <AddExpensePage />;
  else if (route === "/summary") content = <SummaryPage />;
  else content = (
    <div data-testid="home-page">
      <h1>{budget.tripName}</h1>
      <p data-testid="home-total-budget">{budget.totalBudget}</p>
      <p data-testid="home-total-spent">{totalSpent}</p>
      <p data-testid="home-remaining">{remaining}</p>
      <p data-testid="home-percent-used">{percentUsed}</p>
    </div>
  );

  return (
    <div>
      <NavBar />
      {content}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}
