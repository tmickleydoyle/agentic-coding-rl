'use client'
import { useState } from 'react'

export default function App() {
  const [input, setInput] = useState('')

  return (
    <div>
      <h1>Morse Code Translator</h1>
      <div>
        <button data-testid="mode-text-to-morse">Text to Morse</button>
        <button data-testid="mode-morse-to-text">Morse to Text</button>
      </div>
      <label htmlFor="morse-input">Input</label>
      <textarea
        id="morse-input"
        aria-label="Input"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button>Translate</button>
      <button data-testid="clear-btn">Clear</button>
      <p data-testid="output"></p>
    </div>
  )
}
