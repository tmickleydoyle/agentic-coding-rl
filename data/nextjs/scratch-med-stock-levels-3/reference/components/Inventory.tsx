'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Inventory() {
  const { products, addProduct, adjustStock, removeProduct } = useApp()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [onHand, setOnHand] = useState('')
  const [reorderPoint, setReorderPoint] = useState('')

  function handleAdd() {
    const n = name.trim()
    if (!n) return
    addProduct(n, parseFloat(price) || 0, parseInt(onHand) || 0, parseInt(reorderPoint) || 0)
    setName('')
    setPrice('')
    setOnHand('')
    setReorderPoint('')
  }

  return (
    <section aria-label="Inventory view">
      <h1>Inventory</h1>
      <input aria-label="Product name" value={name} onChange={(e) => setName(e.target.value)} />
      <input aria-label="Unit price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input aria-label="On hand" type="number" value={onHand} onChange={(e) => setOnHand(e.target.value)} />
      <input aria-label="Reorder point" type="number" value={reorderPoint} onChange={(e) => setReorderPoint(e.target.value)} />
      <button onClick={handleAdd}>Add product</button>
      <ul>
        {products.map((p) => {
          const isLow = p.onHand < p.reorderPoint
          const lineValue = (p.onHand * p.price).toFixed(2)
          return (
            <li key={p.id}>
              <span>{p.name}</span>
              {isLow && <span>LOW STOCK</span>}
              <span>{`On hand: ${p.onHand}`}</span>
              <span>{`Reorder point: ${p.reorderPoint}`}</span>
              <span>{`Value: $${lineValue}`}</span>
              <button
                aria-label={`Increase stock for ${p.name}`}
                onClick={() => adjustStock(p.id, 1)}
              >
                +
              </button>
              <button
                aria-label={`Decrease stock for ${p.name}`}
                disabled={p.onHand === 0}
                onClick={() => adjustStock(p.id, -1)}
              >
                −
              </button>
              <button
                aria-label={`Remove ${p.name}`}
                onClick={() => removeProduct(p.id)}
              >
                Remove
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
