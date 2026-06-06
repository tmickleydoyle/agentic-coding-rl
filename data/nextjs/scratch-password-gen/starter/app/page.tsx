'use client'
import { useState } from 'react'

export default function App() {
  const [length, setLength] = useState(16)

  return (
    <div>
      <h1>Password Generator</h1>
      <p data-testid="password-display"></p>
      <button>Copy</button>
      <button>Generate</button>
      <input
        aria-label="Length"
        type="range"
        min={8}
        max={64}
        step={1}
        value={length}
        onChange={e => setLength(Number(e.target.value))}
      />
      <span data-testid="length-display">{length}</span>
      <input aria-label="Uppercase (A-Z)" type="checkbox" defaultChecked />
      <input aria-label="Lowercase (a-z)" type="checkbox" defaultChecked />
      <input aria-label="Numbers (0-9)" type="checkbox" defaultChecked />
      <input aria-label="Symbols (!@#...)" type="checkbox" />
      <p data-testid="strength"></p>
    </div>
  )
}
