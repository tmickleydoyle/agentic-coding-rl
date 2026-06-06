'use client'
import { useState } from 'react'

export default function App() {
  const [guess, setGuess] = useState('')
  const [guessesRemaining] = useState(10)

  return (
    <div>
      <h1>Number Guessing Game</h1>
      <p data-testid="feedback">Guess a number between 1 and 100.</p>
      <p>
        Guesses remaining: <strong data-testid="guesses-remaining">{guessesRemaining}</strong>
      </p>
      <label htmlFor="guess-input">Your Guess</label>
      <input
        id="guess-input"
        aria-label="Your Guess"
        type="number"
        value={guess}
        onChange={e => setGuess(e.target.value)}
      />
      <button>Guess</button>
      <button data-testid="new-game-btn">New Game</button>
    </div>
  )
}
