'use client'
import { useState } from 'react'

export default function App() {
  const [_placeholder] = useState(null)
  return (
    <div>
      <h1>Card Game Score Tracker</h1>
      <span data-testid="current-round">Round 1</span>
      <span data-testid="round-count">0 rounds played</span>
      <button data-testid="reset-btn">Reset Game</button>
    </div>
  )
}
