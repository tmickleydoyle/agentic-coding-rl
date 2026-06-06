'use client'
import { useState } from 'react'

const WORDS = [
  { word: 'react', scrambled: 'acter' },
  { word: 'typescript', scrambled: 'crsyptitep' },
  { word: 'component', scrambled: 'mponnoect' },
  { word: 'function', scrambled: 'nticonfun' },
  { word: 'variable', scrambled: 'blaavire' },
]

export default function App() {
  const [guess, setGuess] = useState('')

  return (
    <div>
      <h1>Word Scramble</h1>
      <p data-testid="score">Score: 0 / 5</p>
      <p data-testid="scrambled">{WORDS[0].scrambled}</p>
      <p data-testid="progress">Word 1 of 5</p>
      <input
        aria-label="Your answer"
        value={guess}
        onChange={e => setGuess(e.target.value)}
      />
      <button>Submit</button>
      <button>Skip</button>
      <p data-testid="feedback"></p>
    </div>
  )
}
