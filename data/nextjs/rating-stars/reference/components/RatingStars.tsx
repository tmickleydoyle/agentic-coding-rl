'use client'
import { useState } from 'react'

export default function RatingStars() {
  const [rating, setRating] = useState(0)

  return (
    <div>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          data-testid={`star-${star}`}
          onClick={() => setRating(star)}
          style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {star <= rating ? '★' : '☆'}
        </button>
      ))}
      <span data-testid="rating-value">{rating}</span>
    </div>
  )
}
