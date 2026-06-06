'use client'
import React from 'react'

export function LoansPage() {
  return (
    <div>
      <h1>Loans</h1>
      <form data-testid="add-loan-form">
        <select data-testid="select-book"><option value="">Select a book</option></select>
        <select data-testid="select-member"><option value="">Select a member</option></select>
        <input data-testid="input-due-date" type="date" />
        <button data-testid="btn-add-loan" type="submit">Create Loan</button>
      </form>
      <ul data-testid="loan-list"></ul>
    </div>
  )
}
