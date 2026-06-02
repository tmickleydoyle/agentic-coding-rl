'use client'
import { useState } from 'react'
import { useStock } from '../hooks/useStock'

export function Restock() {
  const { items, receive, sell } = useStock()
  const [itemId, setItemId] = useState('')
  const [recv, setRecv] = useState('')
  const [reduce, setReduce] = useState('')
  return (
    <section aria-label="Restock view">
      <h1>Restock</h1>
      <select aria-label="Item" value={itemId} onChange={(e) => setItemId(e.target.value)}>
        <option value="">Choose an item</option>
        {items.map((it) => (
          <option key={it.id} value={String(it.id)}>
            {it.name}
          </option>
        ))}
      </select>
      <input aria-label="Receive" type="number" value={recv} onChange={(e) => setRecv(e.target.value)} />
      <button
        onClick={() => {
          receive(itemId, recv)
          setRecv('')
        }}
      >
        Receive stock
      </button>
      <input aria-label="Reduce" type="number" value={reduce} onChange={(e) => setReduce(e.target.value)} />
      <button
        onClick={() => {
          sell(itemId, reduce)
          setReduce('')
        }}
      >
        Sell
      </button>
      <ul>
        {items.map((it) => (
          <li key={it.id}>{`${it.name}: On hand ${it.onHand}`}</li>
        ))}
      </ul>
    </section>
  )
}
