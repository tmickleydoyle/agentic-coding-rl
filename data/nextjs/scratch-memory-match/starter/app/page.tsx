'use client'
import { useState } from 'react'

export default function App() {
  const [moves] = useState(0)
  const [matches] = useState(0)

  return (
    <div>
      <h1>Memory Match</h1>
      <div>
        <span>Moves: <strong data-testid="moves">{moves}</strong></span>
        <span>Matches: <strong data-testid="matches">{matches}</strong></span>
      </div>
      <div>
        {Array.from({ length: 16 }, (_, i) => (
          <button key={i} data-testid={`card-${i}`}>?</button>
        ))}
      </div>
      <button data-testid="new-game-btn">New Game</button>
    </div>
  )
}
