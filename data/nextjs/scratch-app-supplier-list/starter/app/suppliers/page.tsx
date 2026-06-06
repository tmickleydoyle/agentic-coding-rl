'use client'
import React from 'react'
export function SuppliersPage() {
  return (
    <div>
      <h1>Suppliers</h1>
      <form data-testid="add-supplier-form">
        <input data-testid="input-supplier-name" placeholder="Name" />
        <input data-testid="input-supplier-category" placeholder="Category" />
        <input data-testid="input-supplier-country" placeholder="Country" />
        <button data-testid="btn-add-supplier" type="submit">Add Supplier</button>
      </form>
      <ul data-testid="supplier-list"></ul>
    </div>
  )
}
