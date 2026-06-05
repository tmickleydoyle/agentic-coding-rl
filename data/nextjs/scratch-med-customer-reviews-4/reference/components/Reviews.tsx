'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Reviews() {
  const { reviews, showUnrespondedOnly, addReview, markResponded, toggleShowUnrespondedOnly } = useApp()
  const [customer, setCustomer] = useState('')
  const [rating, setRating] = useState('')

  const visible = showUnrespondedOnly ? reviews.filter((r) => !r.responded) : reviews

  function handleAdd() {
    const r = Number(rating)
    addReview(customer, r)
    setCustomer('')
    setRating('')
  }

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
          aria-label="Rating"
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
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
      <ul>
        {visible.map((rev) => (
          <li key={rev.id}>
            <span>{rev.customer}</span>
            <span>{`Rating: ${rev.rating}`}</span>
            {rev.responded ? (
              <button disabled>Responded</button>
            ) : (
              <button onClick={() => markResponded(rev.id)}>Mark responded</button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
