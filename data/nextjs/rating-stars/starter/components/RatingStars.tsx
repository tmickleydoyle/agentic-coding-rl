'use client'
import { useState } from 'react'

export default function RatingStars() {
  return (
    <div>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          data-testid={`star-${star}`}
          style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ☆
        </button>
      ))}
      <span data-testid="rating-value">0</span>
    </div>
  )
}
