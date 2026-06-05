'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Menu() {
  const { dishes, addDish } = useApp()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  return (
    <section aria-label="Menu view">
      <h1>Menu</h1>
      <input aria-label="Dish name" value={name} onChange={(e) => setName(e.target.value)} />
      <input aria-label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      <button
        onClick={() => {
          addDish(name, price)
          setName('')
          setPrice('')
        }}
      >
        Add dish
      </button>
      <ul>
        {dishes.map((d) => (
          <li key={d.id}>{`${d.name} - $${d.price}`}</li>
        ))}
      </ul>
    </section>
  )
}
