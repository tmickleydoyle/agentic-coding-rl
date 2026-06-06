'use client'
import { useState } from 'react'

export default function App() {
  const [scorePlayer] = useState(0)
  const [scoreComputer] = useState(0)
  const [scoreTies] = useState(0)

  return (
    <div>
      <h1>Rock Paper Scissors</h1>
      <div>
        <button data-testid="choice-rock">Rock</button>
        <button data-testid="choice-paper">Paper</button>
        <button data-testid="choice-scissors">Scissors</button>
      </div>
      <div>
        <p>You: <span data-testid="score-player">{scorePlayer}</span></p>
        <p>Computer: <span data-testid="score-computer">{scoreComputer}</span></p>
        <p>Ties: <span data-testid="score-ties">{scoreTies}</span></p>
      </div>
      <button data-testid="reset-btn">Reset</button>
    </div>
  )
}
