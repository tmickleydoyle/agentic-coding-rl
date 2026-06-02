'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Inventory() {
  const { products, addProduct, adjustStock, hideLowStock } = useApp()
  const [name, setName] = useState('')
  const [onHand, setOnHand] = useState('0')
  const [reorderPoint, setReorderPoint] = useState('0')
  const [unitPrice, setUnitPrice] = useState('0')

  const displayed = hideLowStock
    ? products.filter((p) => p.onHand >= p.reorderPoint)
    : products

  function handleAdd() {
    const oh = parseInt(onHand, 10)
    const rp = parseInt(reorderPoint, 10)
    const up = parseFloat(unitPrice)
    addProduct(
      name,
      isNaN(oh) ? 0 : oh,
      isNaN(rp) ? 0 : rp,
      isNaN(up) ? 0 : up,
    )
    setName('')
    setOnHand('0')
    setReorderPoint('0')
    setUnitPrice('0')
  }

  return (
    <section aria-label="Inventory view">
      <h1>{`Products (${products.length})`}</h1>
      <div>
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
        <input
          aria-label="Unit price"
          type="number"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
        />
        <button onClick={handleAdd}>Add product</button>
      </div>
      <ul>
        {displayed.map((p) => {
          const isLow = p.onHand < p.reorderPoint
          return (
            <li key={p.id}>
              <span>{p.name}</span>
              {isLow && <span> Low stock</span>}
              <span>{` On hand: ${p.onHand}`}</span>
              <span>{` Reorder: ${p.reorderPoint}`}</span>
              <span>{` Price: $${p.unitPrice.toFixed(2)}`}</span>
              <button aria-label={`Increase ${p.name}`} onClick={() => adjustStock(p.id, 1)}>+</button>
              <button aria-label={`Decrease ${p.name}`} onClick={() => adjustStock(p.id, -1)}>−</button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
