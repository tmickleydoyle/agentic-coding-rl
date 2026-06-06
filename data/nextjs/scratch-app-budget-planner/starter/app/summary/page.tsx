'use client'
import React from 'react';
export function SummaryPage() {
  return (
    <main data-testid="summary-page">
      <h2>Summary</h2>
      <p data-testid="summary-income">Income: 0.00</p>
      <p data-testid="summary-expenses">Expenses: 0.00</p>
      <p data-testid="summary-balance">Balance: 0.00</p>
      <ul data-testid="category-breakdown" />
    </main>
  );
}
