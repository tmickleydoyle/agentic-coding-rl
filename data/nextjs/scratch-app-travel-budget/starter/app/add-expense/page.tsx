import React from "react";

export default function AddExpensePage() {
  return (
    <div data-testid="add-expense-page">
      <input data-testid="input-date" type="date" />
      <input data-testid="input-description" />
      <select data-testid="input-category"><option value="Food">Food</option></select>
      <input data-testid="input-amount" type="number" />
      <input data-testid="input-currency" />
      <input data-testid="input-original-amount" type="number" />
      <button data-testid="submit-expense">Save Expense</button>
    </div>
  );
}
