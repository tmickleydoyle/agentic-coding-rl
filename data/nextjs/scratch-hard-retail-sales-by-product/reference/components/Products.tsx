'use client'
import { useState } from 'react'
import { useShop } from '../hooks/useShop'

export function Products() {
  const { products, addProduct } = useShop()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  return (
    <section aria-label="Products view">
      <h1>Products</h1>
      <input aria-label="Product name" value={name} onChange={(e) => setName(e.target.value)} />
      <input
        aria-label="Unit price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button
        onClick={() => {
          addProduct(name, price)
          setName('')
          setPrice('')
        }}
      >
        Add product
      </button>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{`${p.name} @ $${p.price}`}</li>
        ))}
      </ul>
    </section>
  )
}
