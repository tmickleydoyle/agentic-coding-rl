'use client'
import React from 'react';
export function TransactionsPage() {
  return (
    <main data-testid="transactions-page">
      <h2>Transactions</h2>
      <div data-testid="add-transaction-form">
        <input data-testid="tx-desc-input" placeholder="Description" />
        <input data-testid="tx-amount-input" type="number" placeholder="Amount" />
        <select data-testid="tx-category-select"><option value="">-- Category --</option></select>
        <input data-testid="tx-date-input" type="date" />
        <button data-testid="add-tx-btn">Add</button>
      </div>
      <ul data-testid="transactions-list" />
    </main>
  );
}
