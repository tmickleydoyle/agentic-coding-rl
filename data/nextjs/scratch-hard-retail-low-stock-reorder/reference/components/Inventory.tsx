'use client'
import { useState } from 'react'
import { useStock } from '../hooks/useStock'

export function Inventory() {
  const { items, addItem } = useStock()
  const [name, setName] = useState('')
  const [onHand, setOnHand] = useState('')
  const [reorder, setReorder] = useState('')
  const [target, setTarget] = useState('')
  return (
    <section aria-label="Inventory view">
      <h1>Inventory</h1>
      <input aria-label="Item name" value={name} onChange={(e) => setName(e.target.value)} />
      <input aria-label="On hand" type="number" value={onHand} onChange={(e) => setOnHand(e.target.value)} />
      <input aria-label="Reorder level" type="number" value={reorder} onChange={(e) => setReorder(e.target.value)} />
      <input aria-label="Target" type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
      <button
        onClick={() => {
          addItem(name, onHand, reorder, target)
          setName('')
          setOnHand('')
          setReorder('')
          setTarget('')
        }}
      >
        Add item
      </button>
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            {`${it.name}: On hand ${it.onHand} (reorder at ${it.reorder})${it.onHand <= it.reorder ? ' LOW' : ''}`}
          </li>
        ))}
      </ul>
    </section>
  )
}
