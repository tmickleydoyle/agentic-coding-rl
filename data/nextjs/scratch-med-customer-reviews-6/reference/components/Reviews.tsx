'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Reviews() {
  const { reviews, addReview, toggleResponded } = useApp()
  const [customer, setCustomer] = useState('')
  const [rating, setRating] = useState(5)
  const [filterUnresponded, setFilterUnresponded] = useState(false)

  const visible = filterUnresponded ? reviews.filter((r) => !r.responded) : reviews

  return (
    <section aria-label="Reviews view">
      <h1>Reviews</h1>
      <div>
        <input
          aria-label="Customer name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />
        <input
          type="number"
          aria-label="Rating"
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
      <button onClick={() => setFilterUnresponded((f) => !f)}>
        {filterUnresponded ? 'Show all' : 'Show unresponded only'}
      </button>
      <p>{`Showing: ${visible.length} reviews`}</p>
      <ul>
        {visible.map((rev) => (
          <li key={rev.id}>
            <span>{rev.customer}</span>
            <span>{`Rating: ${rev.rating}`}</span>
            <button onClick={() => toggleResponded(rev.id)}>
              {rev.responded ? 'Responded' : 'Mark responded'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
