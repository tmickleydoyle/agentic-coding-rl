'use client'
import React from 'react'

export function BudgetPage() {
  return (
    <div data-testid="budget-page">
      <h1>Budget</h1>
      <input data-testid="input-budget-category" placeholder="Category" />
      <input data-testid="input-budget-amount" placeholder="Amount" type="number" />
      <input data-testid="input-budget-month" placeholder="Month YYYY-MM" />
      <button data-testid="add-budget-btn">Add Entry</button>
      <div data-testid="total-budget">0</div>
    </div>
  )
}
