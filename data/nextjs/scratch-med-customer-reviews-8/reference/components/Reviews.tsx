'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Reviews() {
  const { reviews, showUnrespondedOnly, addReview, markResponded, toggleShowUnrespondedOnly } = useApp()
  const [customer, setCustomer] = useState('')
  const [ratingStr, setRatingStr] = useState('')

  function handleAdd() {
    const rating = Number(ratingStr)
    addReview(customer, rating)
    setCustomer('')
    setRatingStr('')
  }

  const visible = showUnrespondedOnly ? reviews.filter((r) => !r.responded) : reviews

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
          aria-label="Rating"
          type="number"
          value={ratingStr}
          onChange={(e) => setRatingStr(e.target.value)}
        />
        <button onClick={handleAdd}>Add review</button>
      </div>
      <label>
        <input
          type="checkbox"
          aria-label="Show unresponded only"
          checked={showUnrespondedOnly}
          onChange={toggleShowUnrespondedOnly}
        />
        Show unresponded only
      </label>
      <p>{`Showing: ${visible.length} reviews`}</p>
      <ul>
        {visible.map((rev) => (
          <li key={rev.id}>
            <span>{rev.customer}</span>
            <span>{`Rating: ${rev.rating}`}</span>
            <button
              onClick={() => markResponded(rev.id)}
              disabled={rev.responded}
            >
              {rev.responded ? 'Responded' : 'Mark responded'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
