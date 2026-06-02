'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { useTotals } from '../hooks/useTotals'
import { money } from '../lib/money'

export function Check() {
  const { items, lines, addLine, discount, setDiscount, itemById } = useApp()
  const { subtotal } = useTotals()
  const [itemId, setItemId] = useState('')
  const [qty, setQty] = useState('')
  const current = itemId || (items[0] ? String(items[0].id) : '')

  return (
    <section aria-label="Check view">
      <h1>Check</h1>
      <select aria-label="Item" value={current} onChange={(e) => setItemId(e.target.value)}>
        {items.map((i) => (
          <option key={i.id} value={i.id}>
            {i.name}
          </option>
        ))}
      </select>
      <input aria-label="Quantity" type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
      <button
        onClick={() => {
          addLine(current, qty)
          setQty('')
        }}
      >
        Add to check
      </button>
      <label>
        Discount %
        <input
          aria-label="Discount %"
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />
      </label>
      <ul>
        {lines.map((l) => {
          const it = itemById(l.itemId)
          if (!it) return null
          return <li key={l.id}>{`${l.qty} × ${it.name} — ${money(it.price * l.qty)}`}</li>
        })}
      </ul>
      <p>{`Subtotal: ${money(subtotal)}`}</p>
    </section>
  )
}
