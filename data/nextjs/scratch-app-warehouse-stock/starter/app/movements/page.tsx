'use client'
import React from 'react'
export function MovementsPage() {
  return (
    <div>
      <h1>Stock Movements</h1>
      <form data-testid="add-movement-form">
        <select data-testid="select-movement-item"><option value="">Select item</option></select>
        <select data-testid="select-movement-type"><option value="inbound">Inbound</option><option value="outbound">Outbound</option></select>
        <input data-testid="input-movement-quantity" type="number" placeholder="Quantity" />
        <input data-testid="input-movement-notes" placeholder="Notes" />
        <button data-testid="btn-add-movement" type="submit">Record Movement</button>
      </form>
      <ul data-testid="movement-list"></ul>
    </div>
  )
}
