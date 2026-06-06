'use client'
import React from 'react'

export function OrdersPage() {
  return (
    <div>
      <h1>My Orders</h1>
      <form data-testid="add-order-form">
        <input data-testid="input-order-number" placeholder="Order Number" />
        <input data-testid="input-order-date" type="date" />
        <input data-testid="input-order-total" type="number" placeholder="Total" />
        <button data-testid="btn-add-order" type="submit">Add Order</button>
      </form>
      <ul data-testid="order-list"></ul>
    </div>
  )
}
