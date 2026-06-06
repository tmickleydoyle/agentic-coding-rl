'use client'
import { useState } from 'react'

export default function App() {
  const [input, setInput] = useState('')

  return (
    <div>
      <h1>Number to Words</h1>
      <input
        aria-label="Enter a number"
        type="number"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button>Convert</button>
      <p data-testid="result"></p>
      <p data-testid="error"></p>
    </div>
  )
}
