'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Inventory() {
  const { products, addProduct, increaseStock, decreaseStock, removeProduct } = useApp()
  const [name, setName] = useState('')
  const [onHand, setOnHand] = useState('0')
  const [reorderPoint, setReorderPoint] = useState('0')

  function handleAdd() {
    addProduct(name.trim(), parseInt(onHand, 10) || 0, parseInt(reorderPoint, 10) || 0)
    setName('')
    setOnHand('0')
    setReorderPoint('0')
  }

  return (
    <section aria-label="Inventory view">
      <h1>{`Products (${products.length})`}</h1>
      <input
        aria-label="Product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        aria-label="On hand"
        type="number"
        value={onHand}
        onChange={(e) => setOnHand(e.target.value)}
      />
      <input
        aria-label="Reorder point"
        type="number"
        value={reorderPoint}
        onChange={(e) => setReorderPoint(e.target.value)}
      />
      <button onClick={handleAdd}>Add product</button>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <span>{p.name}</span>
            <span>{`On hand: ${p.onHand}`}</span>
            <span>{`Reorder point: ${p.reorderPoint}`}</span>
            {p.onHand < p.reorderPoint && <span>LOW STOCK</span>}
            <button aria-label={`Increase ${p.name}`} onClick={() => increaseStock(p.id)}>+</button>
            <button aria-label={`Decrease ${p.name}`} onClick={() => decreaseStock(p.id)}>−</button>
            <button aria-label={`Remove ${p.name}`} onClick={() => removeProduct(p.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
