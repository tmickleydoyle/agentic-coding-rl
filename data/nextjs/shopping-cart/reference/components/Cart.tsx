'use client'
import { useState } from 'react'

type Product = { id: string; name: string; price: number }

export default function Cart({ products }: { products: Product[] }) {
  const [qty, setQty] = useState<Record<string, number>>({})

  const add = (id: string) => setQty((q) => ({ ...q, [id]: (q[id] ?? 0) + 1 }))
  const remove = (id: string) =>
    setQty((q) => {
      const next = (q[id] ?? 0) - 1
      const out = { ...q }
      if (next <= 0) delete out[id]
      else out[id] = next
      return out
    })

  const byId = Object.fromEntries(products.map((p) => [p.id, p]))
  const total = Object.entries(qty).reduce(
    (sum, [id, n]) => sum + (byId[id]?.price ?? 0) * n,
    0
  )

  return (
    <div>
      <ul data-testid="catalog">
        {products.map((p) => (
          <li key={p.id}>
            {p.name}
            <button data-testid={`add-${p.id}`} onClick={() => add(p.id)}>
              Add
            </button>
          </li>
        ))}
      </ul>
      <ul data-testid="cart">
        {Object.entries(qty).map(([id, n]) => (
          <li key={id}>
            {byId[id].name} ×{n}
            <button data-testid={`remove-${id}`} onClick={() => remove(id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <span data-testid="total">${total}</span>
    </div>
  )
}
