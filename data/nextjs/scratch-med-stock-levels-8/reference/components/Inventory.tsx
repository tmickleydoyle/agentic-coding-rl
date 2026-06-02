'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Product } from '../lib/types'

function isLow(p: Product) {
  return p.onHand < p.reorderPoint
}

export function Inventory() {
  const { products, addProduct, adjustProduct, removeProduct, showLowOnly, toggleShowLowOnly } = useApp()
  const [name, setName] = useState('')
  const [onHand, setOnHand] = useState('')
  const [reorderPoint, setReorderPoint] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [adjustingId, setAdjustingId] = useState<number | null>(null)
  const [adjustQty, setAdjustQty] = useState('')

  function handleAdd() {
    const oh = parseFloat(onHand)
    const rp = parseFloat(reorderPoint)
    const up = parseFloat(unitPrice)
    addProduct(name, oh, rp, up)
    setName('')
    setOnHand('')
    setReorderPoint('')
    setUnitPrice('')
  }

  function handleAdjustClick(id: number) {
    if (adjustingId === id) {
      setAdjustingId(null)
      setAdjustQty('')
    } else {
      setAdjustingId(id)
      setAdjustQty('')
    }
  }

  function handleConfirm(id: number) {
    const delta = parseInt(adjustQty, 10)
    if (!Number.isFinite(delta)) return
    adjustProduct(id, delta)
    setAdjustingId(null)
    setAdjustQty('')
  }

  const visible = showLowOnly ? products.filter(isLow) : products

  return (
    <section aria-label="Inventory view">
      <h1>Inventory</h1>
      <div>
        <input aria-label="Product name" value={name} onChange={(e) => setName(e.target.value)} />
        <input aria-label="On hand" value={onHand} onChange={(e) => setOnHand(e.target.value)} type="number" />
        <input aria-label="Reorder point" value={reorderPoint} onChange={(e) => setReorderPoint(e.target.value)} type="number" />
        <input aria-label="Unit price" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} type="number" step="0.01" />
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
        {visible.map((p) => (
          <li key={p.id}>
            <span>{p.name}</span>
            {isLow(p) && <span> Low stock</span>}
            <span>{` On hand: ${p.onHand}`}</span>
            <span>{` Reorder: ${p.reorderPoint}`}</span>
            <span>{` Price: $${p.unitPrice.toFixed(2)}`}</span>
            <button aria-label={`Adjust ${p.name}`} onClick={() => handleAdjustClick(p.id)}>Adjust</button>
            {adjustingId === p.id && (
              <span>
                <input
                  aria-label="Adjust qty"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  type="number"
                />
                <button aria-label={`Confirm adjust ${p.name}`} onClick={() => handleConfirm(p.id)}>Confirm</button>
              </span>
            )}
            <button aria-label={`Remove ${p.name}`} onClick={() => removeProduct(p.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
