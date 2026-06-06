'use client'
import { useState } from 'react'

export default function App() {
  const [_placeholder] = useState(null)
  return (
    <div>
      <h1>Chess Notation Recorder</h1>
      <span data-testid="current-turn">White to move</span>
      <span data-testid="move-count">0 moves</span>
      <button data-testid="undo-btn" disabled>Undo</button>
      <button data-testid="clear-btn">Clear All</button>
    </div>
  )
}
