'use client'
import { useState } from 'react'
import { useShop } from '../hooks/useShop'

export function Sales() {
  const { products, sales, recordSale } = useShop()
  const [productId, setProductId] = useState('')
  const [qty, setQty] = useState('')
  const nameOf = (id: number) => products.find((p) => p.id === id)?.name ?? '?'
  return (
    <section aria-label="Sales view">
      <h1>Sales</h1>
      <select
        aria-label="Product"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      >
        <option value="">Choose a product</option>
        {products.map((p) => (
          <option key={p.id} value={String(p.id)}>
            {p.name}
          </option>
        ))}
      </select>
      <input
        aria-label="Quantity"
        type="number"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />
      <button
        onClick={() => {
          recordSale(productId, qty)
          setQty('')
        }}
      >
        Record sale
      </button>
      <ul>
        {sales.map((s) => (
          <li key={s.id}>{`${nameOf(s.productId)} x ${s.qty} = $${s.price * s.qty}`}</li>
        ))}
      </ul>
    </section>
  )
}
