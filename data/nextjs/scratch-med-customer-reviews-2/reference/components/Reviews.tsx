'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Reviews() {
  const { reviews, addReview, toggleResponded, showUnrespondedOnly, toggleFilter } = useApp()
  const [customer, setCustomer] = useState('')
  const [rating, setRating] = useState(5)

  const displayed = showUnrespondedOnly ? reviews.filter((r) => !r.responded) : reviews

  return (
    <section aria-label="Reviews view">
      <h1>{`Reviews (${displayed.length})`}</h1>
      <div>
        <input
          aria-label="Customer name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />
        <input
          aria-label="Rating"
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
        <button
          onClick={() => {
            addReview(customer, rating)
            setCustomer('')
            setRating(5)
          }}
        >
          Add review
        </button>
      </div>
      <label>
        <input
          type="checkbox"
          aria-label="Show unresponded only"
          checked={showUnrespondedOnly}
          onChange={toggleFilter}
        />
        Show unresponded only
      </label>
      <ul>
        {displayed.map((rev) => (
          <li key={rev.id}>
            <span>{rev.customer}</span>
            <span>{`Rating: ${rev.rating}`}</span>
            <button onClick={() => toggleResponded(rev.id)}>
              {rev.responded ? 'Mark unresponded' : 'Mark responded'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
