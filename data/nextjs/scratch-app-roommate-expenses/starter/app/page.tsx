import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <div data-testid="dashboard-page"><h1>Dashboard</h1><div data-testid="total-expenses">0</div><div data-testid="roommate-count">0</div></div>}
      {route === "/expenses" && (
        <div data-testid="expenses-page">
          <h1>Expenses</h1>
          <input data-testid="expense-description-input" placeholder="Description" />
          <input data-testid="expense-amount-input" placeholder="Amount" type="number" />
          <select data-testid="expense-payer-select"><option value="">Select Payer</option></select>
          <input data-testid="expense-date-input" placeholder="Date" />
          <input data-testid="expense-category-input" placeholder="Category" />
          <button data-testid="add-expense-btn">Add Expense</button>
          <ul data-testid="expense-list"></ul>
        </div>
      )}
      {route === "/roommates" && (
        <div data-testid="roommates-page">
          <h1>Roommates</h1>
          <input data-testid="roommate-name-input" placeholder="Name" />
          <input data-testid="roommate-email-input" placeholder="Email" />
          <button data-testid="add-roommate-btn">Add Roommate</button>
          <ul data-testid="roommate-list"></ul>
        </div>
      )}
      {route === "/settle" && (
        <div data-testid="settle-page">
          <h1>Settle Up</h1>
          <select data-testid="settle-from-select"><option value="">From</option></select>
          <select data-testid="settle-to-select"><option value="">To</option></select>
          <input data-testid="settle-amount-input" placeholder="Amount" type="number" />
          <input data-testid="settle-date-input" placeholder="Date" />
          <button data-testid="settle-btn">Settle</button>
        </div>
      )}
      {route === "/history" && <div data-testid="history-page"><h1>History</h1><ul data-testid="settlement-list"></ul></div>}
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
