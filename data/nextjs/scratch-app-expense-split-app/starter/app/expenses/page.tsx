'use client'
import React from 'react';
export function ExpensesPage() {
  return (
    <main data-testid="expenses-page">
      <h2>Expenses</h2>
      <div data-testid="add-expense-form">
        <select data-testid="expense-group-select"><option value="">-- Select Group --</option></select>
        <input data-testid="expense-desc-input" placeholder="Description" />
        <input data-testid="expense-amount-input" type="number" placeholder="Amount" />
        <select data-testid="expense-paidby-select"><option value="">-- Paid By --</option></select>
        <input data-testid="expense-date-input" type="date" />
        <button data-testid="add-expense-btn">Add Expense</button>
      </div>
      <ul data-testid="expenses-list" />
    </main>
  );
}
