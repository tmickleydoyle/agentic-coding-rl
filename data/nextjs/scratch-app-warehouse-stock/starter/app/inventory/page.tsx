'use client'
import React from 'react'
export function InventoryPage() {
  return (
    <div>
      <h1>Inventory</h1>
      <form data-testid="add-inventory-form">
        <input data-testid="input-item-name" placeholder="Name" />
        <input data-testid="input-item-sku" placeholder="SKU" />
        <input data-testid="input-item-quantity" type="number" placeholder="Quantity" />
        <select data-testid="select-item-location"><option value="">Select location</option></select>
        <input data-testid="input-item-category" placeholder="Category" />
        <button data-testid="btn-add-item" type="submit">Add Item</button>
      </form>
      <ul data-testid="inventory-list"></ul>
    </div>
  )
}
