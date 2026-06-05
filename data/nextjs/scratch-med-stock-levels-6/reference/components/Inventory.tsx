'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Inventory() {
  const { products, addProduct, removeProduct, increaseStock, decreaseStock } = useApp()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  function handleAdd() {
    const p = parseFloat(price)
    addProduct(name, p)
    setName('')
    setPrice('')
  }

  return (
    <section aria-label="Inventory view">
      <h1>Inventory</h1>
      <input
        aria-label="Product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        aria-label="Unit price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={handleAdd}>Add product</button>
      <ul>
        {products.map((p) => {
          const isLow = p.onHand < p.reorderPoint
          return (
            <li key={p.id}>
              <span>{p.name}</span>
              {isLow && <span>Low stock</span>}
              <span>{`On hand: ${p.onHand}`}</span>
              <span>{`Reorder: ${p.reorderPoint}`}</span>
              <button
                aria-label={`Increase ${p.name}`}
                onClick={() => increaseStock(p.id)}
              >
                +
              </button>
              <button
                aria-label={`Decrease ${p.name}`}
                disabled={p.onHand === 0}
                onClick={() => decreaseStock(p.id)}
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
