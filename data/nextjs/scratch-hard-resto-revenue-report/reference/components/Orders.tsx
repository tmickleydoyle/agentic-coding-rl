'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Orders() {
  const { dishes, tickets, addTicket } = useApp()
  const [dishId, setDishId] = useState('')
  const [qty, setQty] = useState('')

  const current = dishId || (dishes[0] ? String(dishes[0].id) : '')

  const dishById = (id: number) => dishes.find((d) => d.id === id)
  let total = 0
  tickets.forEach((t) => {
    const d = dishById(t.dishId)
    if (d) total += d.price * t.qty
  })

  return (
    <section aria-label="Orders view">
      <h1>Orders</h1>
      <select aria-label="Dish" value={current} onChange={(e) => setDishId(e.target.value)}>
        {dishes.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
      <input aria-label="Quantity" type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
      <button
        onClick={() => {
          addTicket(current, qty)
          setQty('')
        }}
      >
        Add to order
      </button>
      <ul>
        {tickets.map((t) => {
          const d = dishById(t.dishId)
          if (!d) return null
          return <li key={t.id}>{`${t.qty} × ${d.name} = $${d.price * t.qty}`}</li>
        })}
      </ul>
      <p>{`Order total: $${total}`}</p>
    </section>
  )
}
