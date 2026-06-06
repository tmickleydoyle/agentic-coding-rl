'use client'
import { useState } from 'react'

const PASSAGE = "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump."

export default function App() {
  const [typed, setTyped] = useState('')

  return (
    <div>
      <h1>Typing Test</h1>
      <p data-testid="passage">{PASSAGE}</p>
      <textarea
        aria-label="Type here"
        value={typed}
        onChange={e => setTyped(e.target.value)}
        disabled
      />
      <button>Start</button>
      <p data-testid="wpm">WPM: 0</p>
      <p data-testid="accuracy">Accuracy: 100%</p>
      <p data-testid="status">Press Start to begin</p>
    </div>
  )
}
