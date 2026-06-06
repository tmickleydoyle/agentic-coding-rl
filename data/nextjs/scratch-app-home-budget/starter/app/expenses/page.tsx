import React from "react";

export function ExpensesPage() {
  return (
    <div data-testid="expenses-page">
      <div data-testid="add-expense-form">
        <input data-testid="expense-description" />
        <input data-testid="expense-amount" type="number" />
        <select data-testid="expense-category"><option value="other">other</option></select>
        <input data-testid="expense-date" type="date" />
        <button data-testid="add-expense-btn">Add Expense</button>
      </div>
      <ul data-testid="expense-list"></ul>
    </div>
  );
}
