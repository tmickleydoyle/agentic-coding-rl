'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Reviews() {
  const { reviews, filterUnresponded, addReview, toggleResponded, toggleFilter } = useApp()
  const [customer, setCustomer] = useState('')
  const [rating, setRating] = useState('')

  const visible = filterUnresponded ? reviews.filter((r) => !r.responded) : reviews

  return (
    <section aria-label="Reviews view">
      <h1>{`Reviews (${visible.length})`}</h1>
      <div>
        <input
          aria-label="Customer name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />
        <input
          aria-label="Rating (1-5)"
          type="number"
          min={1}
          max={5}
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
      </div>
      <label>
        <input
          type="checkbox"
          aria-label="Filter: unresponded only"
          checked={filterUnresponded}
          onChange={toggleFilter}
        />
        Filter: unresponded only
      </label>
      <ul>
        {visible.map((rev) => (
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
