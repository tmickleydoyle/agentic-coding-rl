'use client'
import { useState } from 'react'

type Item = { id: number; name: string; price: number; qty: number }

const INITIAL: Item[] = [
  { id: 1, name: 'Widget', price: 2.5, qty: 2 },
  { id: 2, name: 'Gadget', price: 4.0, qty: 1 },
  { id: 3, name: 'Doohickey', price: 1.25, qty: 0 },
]

export default function Cart() {
  const [items, setItems] = useState<Item[]>(INITIAL)

  const setQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it
      )
    )
  }

  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0)

  return (
    <div>
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <span data-testid={`name-${it.id}`}>{it.name}</span>
            <button data-testid={`dec-${it.id}`} onClick={() => setQty(it.id, -1)}>
              -
            </button>
            <span data-testid={`qty-${it.id}`}>{it.qty}</span>
            <button data-testid={`inc-${it.id}`} onClick={() => setQty(it.id, 1)}>
              +
            </button>
          </li>
        ))}
      </ul>
      <p data-testid="total">${total.toFixed(2)}</p>
    </div>
  )
}
