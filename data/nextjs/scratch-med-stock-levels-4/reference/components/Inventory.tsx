'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Inventory() {
  const { products, addProduct, removeProduct, adjustStock } = useApp()
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
      <h1>{`Inventory (${products.length})`}</h1>
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
          const lowStock = p.onHand < p.reorderAt
          return (
            <li key={p.id}>
              <span>{p.name}</span>
              {lowStock && <span> LOW STOCK</span>}
              <span>{` On hand: ${p.onHand}`}</span>
              <span>{` Reorder at: ${p.reorderAt}`}</span>
              <button
                aria-label={`Increase ${p.name}`}
                onClick={() => adjustStock(p.id, 1)}
              >
                +
              </button>
              <button
                aria-label={`Decrease ${p.name}`}
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
