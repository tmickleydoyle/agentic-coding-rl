'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { money } from '../lib/money'

export function Items() {
  const { items, addItem } = useApp()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  return (
    <section aria-label="Items view">
      <h1>Items</h1>
      <input aria-label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input aria-label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      <button
        onClick={() => {
          addItem(name, price)
          setName('')
          setPrice('')
        }}
      >
        Add item
      </button>
      <ul>
        {items.map((i) => (
          <li key={i.id}>{`${i.name} — ${money(i.price)}`}</li>
        ))}
      </ul>
    </section>
  )
}
