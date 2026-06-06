'use client';
import React from 'react';

export function ExpensesPage() {
  return (
    <div>
      <h1>Expenses</h1>
      <input data-testid="expense-description" placeholder="Description" />
      <input data-testid="expense-amount" type="number" placeholder="Amount" />
      <select data-testid="expense-category"></select>
      <input data-testid="expense-date" type="date" />
      <button data-testid="add-expense-btn">Add</button>
      <table><tbody></tbody></table>
    </div>
  );
}
