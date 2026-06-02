'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Reviews() {
  const { reviews, addReview, toggleResponded, showUnrespondedOnly, toggleShowUnrespondedOnly } = useApp()
  const [customer, setCustomer] = useState('')
  const [rating, setRating] = useState('')

  const visible = showUnrespondedOnly ? reviews.filter((r) => !r.responded) : reviews

  return (
    <section aria-label="Reviews view">
      <h1>{`Reviews (${visible.length})`}</h1>
      <input
        aria-label="Customer name"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
      />
      <input
        aria-label="Rating (1-5)"
        type="number"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />
      <button
        onClick={() => {
          const r = parseInt(rating, 10)
          addReview(customer, r)
          setCustomer('')
          setRating('')
        }}
      >
        Add review
      </button>
      <label>
        <input
          type="checkbox"
          aria-label="Show unresponded only"
          checked={showUnrespondedOnly}
          onChange={toggleShowUnrespondedOnly}
        />
        Show unresponded only
      </label>
      <ul>
        {visible.map((r) => (
          <li key={r.id}>
            <span>{r.customer}</span>
            <span>{`Rating: ${r.rating}`}</span>
            <button onClick={() => toggleResponded(r.id)}>
              {r.responded ? 'Mark unresponded' : 'Mark responded'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
