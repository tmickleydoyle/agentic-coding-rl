'use client'
import { useState } from 'react'

type Product = { id: string; name: string; price: number }

export default function Cart({ products }: { products: Product[] }) {
  // TODO: track {[id]: qty}. Render catalog with Add buttons (data-testid="add-<id>"),
  // cart list with quantities and Remove buttons (data-testid="remove-<id>"), total "$X".
  return (
    <div>
      <ul data-testid="catalog">
        {products.map((p) => (
          <li key={p.id}>
            {p.name}
            <button data-testid={`add-${p.id}`}>Add</button>
          </li>
        ))}
      </ul>
      <ul data-testid="cart"></ul>
      <span data-testid="total">$0</span>
    </div>
  )
}
