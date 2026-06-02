'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Inventory() {
  const { products, addProduct, increase, decrease, setReorder, showLowStockOnly } = useApp()
  const [nameInput, setNameInput] = useState('')
  const [priceInput, setPriceInput] = useState('')

  const visible = showLowStockOnly
    ? products.filter((p) => p.onHand < p.reorderPoint)
    : products

  return (
    <section aria-label="Inventory view">
      <h1>Inventory</h1>
      <div>
        <input
          aria-label="Product name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <input
          aria-label="Unit price"
          type="number"
          value={priceInput}
          onChange={(e) => setPriceInput(e.target.value)}
        />
        <button
          onClick={() => {
            const price = parseFloat(priceInput)
            addProduct(nameInput, price)
            setNameInput('')
            setPriceInput('')
          }}
        >
          Add product
        </button>
      </div>
      <ul>
        {visible.map((p) => (
          <ProductRow
            key={p.id}
            id={p.id}
            name={p.name}
            onHand={p.onHand}
            reorderPoint={p.reorderPoint}
            price={p.price}
            isLow={p.onHand < p.reorderPoint}
            onIncrease={() => increase(p.id)}
            onDecrease={() => decrease(p.id)}
            onSaveReorder={(v) => setReorder(p.id, v)}
          />
        ))}
      </ul>
    </section>
  )
}

function ProductRow({
  id, name, onHand, reorderPoint, price, isLow, onIncrease, onDecrease, onSaveReorder,
}: {
  id: number
  name: string
  onHand: number
  reorderPoint: number
  price: number
  isLow: boolean
  onIncrease: () => void
  onDecrease: () => void
  onSaveReorder: (v: number) => void
}) {
  const [reorderInput, setReorderInput] = useState(String(reorderPoint))

  return (
    <li>
      <span>{name}</span>
      {isLow && <span>Low stock</span>}
      <span>{`On hand: ${onHand}`}</span>
      <span>{`Reorder: ${reorderPoint}`}</span>
      <span>{`Unit: $${price.toFixed(2)}`}</span>
      <button aria-label={`Increase ${name}`} onClick={onIncrease}>Increase</button>
      <button aria-label={`Decrease ${name}`} onClick={onDecrease}>Decrease</button>
      <input
        aria-label={`Reorder point for ${name}`}
        type="number"
        value={reorderInput}
        onChange={(e) => setReorderInput(e.target.value)}
      />
      <button
        aria-label={`Save reorder for ${name}`}
        onClick={() => {
          const v = parseInt(reorderInput, 10)
          if (!isNaN(v) && v >= 0) onSaveReorder(v)
        }}
      >
        Save reorder
      </button>
    </li>
  )
}
