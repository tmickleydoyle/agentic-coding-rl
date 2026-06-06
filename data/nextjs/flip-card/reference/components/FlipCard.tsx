'use client'
import { useState } from 'react'

export default function FlipCard() {
  const [flipped, setFlipped] = useState(false)

  return (
    <div data-testid="flip-card">
      {!flipped && (
        <div data-testid="front-face">Front</div>
      )}
      {flipped && (
        <div data-testid="back-face">Back</div>
      )}
      <button data-testid="flip-btn" onClick={() => setFlipped(f => !f)}>
        Flip
      </button>
    </div>
  )
}
