'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Reviews() {
  const { reviews, showUnrespondedOnly, addReview, markResponded, toggleFilter } = useApp()
  const [customer, setCustomer] = useState('')
  const [rating, setRating] = useState(5)

  const visible = showUnrespondedOnly ? reviews.filter((r) => !r.responded) : reviews

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
          type="number"
          aria-label="Rating (1-5)"
          value={rating}
          min={1}
          max={5}
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
        {visible.map((rv) => (
          <li key={rv.id}>
            <span>{rv.customer}</span>
            <span>{`Rating: ${rv.rating}`}</span>
            {rv.responded ? (
              <button disabled>Responded</button>
            ) : (
              <button onClick={() => markResponded(rv.id)}>Mark responded</button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
