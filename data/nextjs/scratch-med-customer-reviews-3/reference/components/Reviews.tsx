'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Reviews() {
  const { reviews, addReview, toggleResponded } = useApp()
  const [customer, setCustomer] = useState('')
  const [rating, setRating] = useState('')
  const [filterUnresponded, setFilterUnresponded] = useState(false)

  const total = reviews.length
  const displayed = filterUnresponded ? reviews.filter((r) => !r.responded) : reviews

  function handleAdd() {
    const r = Number(rating)
    addReview(customer, r)
    setCustomer('')
    setRating('')
  }

  return (
    <section aria-label="Reviews view">
      <h1>{`Reviews (${total})`}</h1>
      <input
        aria-label="Customer name"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
      />
      <input
        aria-label="Rating"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        type="number"
        min={1}
        max={5}
      />
      <button onClick={handleAdd}>Add review</button>
      <label>
        <input
          type="checkbox"
          aria-label="Show unresponded only"
          checked={filterUnresponded}
          onChange={() => setFilterUnresponded((v) => !v)}
        />
        Show unresponded only
      </label>
      <ul>
        {displayed.map((r) => (
          <li key={r.id}>
            <span>{r.customer}</span>
            <span>{`Rating: ${r.rating}`}</span>
            {r.responded && <span>Responded</span>}
            <button onClick={() => toggleResponded(r.id)}>
              {r.responded ? 'Mark unresponded' : 'Mark responded'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
