'use client'
import React from 'react'
export function ContractsPage() {
  return (
    <div>
      <h1>Contracts</h1>
      <form data-testid="add-contract-form">
        <select data-testid="select-contract-supplier"><option value="">Select supplier</option></select>
        <input data-testid="input-contract-start" type="date" />
        <input data-testid="input-contract-end" type="date" />
        <input data-testid="input-contract-value" type="number" placeholder="Value" />
        <button data-testid="btn-add-contract" type="submit">Add Contract</button>
      </form>
      <ul data-testid="contract-list"></ul>
    </div>
  )
}
