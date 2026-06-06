'use client'
import { useState, useCallback } from 'react'

const MAX_GUESSES = 10

function randomSecret(): number {
  return Math.floor(Math.random() * 100) + 1
}

type GameState = 'playing' | 'won' | 'lost'

export default function App() {
  const [secret, setSecret] = useState(() => randomSecret())
  const [guess, setGuess] = useState('')
  const [feedback, setFeedback] = useState('Guess a number between 1 and 100.')
  const [guessesRemaining, setGuessesRemaining] = useState(MAX_GUESSES)
  const [history, setHistory] = useState<number[]>([])
  const [gameState, setGameState] = useState<GameState>('playing')
  const [validationError, setValidationError] = useState('')
  const [guessCount, setGuessCount] = useState(0)

  const handleGuess = useCallback(() => {
    const num = parseInt(guess, 10)
    if (!guess.trim() || isNaN(num) || num < 1 || num > 100) {
      setValidationError('Please enter a number between 1 and 100.')
      return
    }
    setValidationError('')

    const newGuessCount = guessCount + 1
    const newRemaining = guessesRemaining - 1

    setGuessCount(newGuessCount)
    setGuessesRemaining(newRemaining)
    setHistory(prev => [num, ...prev])
    setGuess('')

    if (num === secret) {
      setFeedback(`Correct! You guessed it in ${newGuessCount} guess(es)!`)
      setGameState('won')
    } else if (newRemaining === 0) {
      setFeedback(`Game over! The number was ${secret}.`)
      setGameState('lost')
    } else if (num < secret) {
      setFeedback('Too low! Try higher.')
    } else {
      setFeedback('Too high! Try lower.')
    }
  }, [guess, secret, guessesRemaining, guessCount])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleGuess()
  }

  function handleNewGame() {
    setSecret(randomSecret())
    setGuess('')
    setFeedback('Guess a number between 1 and 100.')
    setGuessesRemaining(MAX_GUESSES)
    setHistory([])
    setGameState('playing')
    setValidationError('')
    setGuessCount(0)
  }

  const disabled = gameState !== 'playing'

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1rem' }}>
      <h1>Number Guessing Game</h1>
      <p data-testid="feedback">{feedback}</p>
      <p>
        Guesses remaining: <strong data-testid="guesses-remaining">{guessesRemaining}</strong>
      </p>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="guess-input">Your Guess</label>
        <input
          id="guess-input"
          aria-label="Your Guess"
          type="number"
          min={1}
          max={100}
          value={guess}
          onChange={e => setGuess(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          style={{ marginLeft: '0.5rem', width: '80px' }}
        />
        <button onClick={handleGuess} disabled={disabled} style={{ marginLeft: '0.5rem' }}>
          Guess
        </button>
      </div>
      {validationError && (
        <p data-testid="validation-error" style={{ color: 'red' }}>
          {validationError}
        </p>
      )}
      <button data-testid="new-game-btn" onClick={handleNewGame}>
        New Game
      </button>
      {history.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h2>Guess History</h2>
          <ul>
            {history.map((g, idx) => (
              <li key={idx} data-testid="guess-history-item">
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
