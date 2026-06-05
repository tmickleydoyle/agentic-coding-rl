'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Inventory() {
  const { products, addProduct, adjustStock, showLowOnly, toggleShowLowOnly } = useApp()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [onHand, setOnHand] = useState('')
  const [reorder, setReorder] = useState('')

  const displayed = showLowOnly
    ? products.filter((p) => p.onHand <= p.reorderPoint)
    : products

  function handleAdd() {
    const unitPrice = parseFloat(price)
    const oh = parseInt(onHand, 10)
    const rp = parseInt(reorder, 10)
    addProduct(name, unitPrice, oh, rp)
    setName('')
    setPrice('')
    setOnHand('')
    setReorder('')
  }

  return (
    <section aria-label="Inventory view">
      <h1>{`Inventory (${displayed.length})`}</h1>
      <div>
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
        <input
          aria-label="On hand"
          type="number"
          value={onHand}
          onChange={(e) => setOnHand(e.target.value)}
        />
        <input
          aria-label="Reorder point"
          type="number"
          value={reorder}
          onChange={(e) => setReorder(e.target.value)}
        />
        <button onClick={handleAdd}>Add product</button>
      </div>
      <label>
        <input
          type="checkbox"
          aria-label="Show low stock only"
          checked={showLowOnly}
          onChange={toggleShowLowOnly}
        />
        Show low stock only
      </label>
      <ul>
        {displayed.map((p) => {
          const isLow = p.onHand <= p.reorderPoint
          return (
            <li key={p.id}>
              <span>{p.name}</span>
              <span>{`On hand: ${p.onHand}`}</span>
              <span>{`Reorder at: ${p.reorderPoint}`}</span>
              {isLow && <span>Low stock</span>}
              <button aria-label={`Increase ${p.name}`} onClick={() => adjustStock(p.id, 1)}>
                +
              </button>
              <button
                aria-label={`Decrease ${p.name}`}
                onClick={() => adjustStock(p.id, -1)}
              >
                −
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
