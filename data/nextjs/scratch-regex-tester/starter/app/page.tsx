'use client'
import { useState } from 'react'

export default function App() {
  const [pattern, setPattern] = useState('')
  const [testStr, setTestStr] = useState('')

  return (
    <div>
      <h1>Regex Tester</h1>
      <input
        aria-label="Pattern"
        type="text"
        value={pattern}
        onChange={e => setPattern(e.target.value)}
      />
      <input aria-label="Global (g)" type="checkbox" defaultChecked />
      <input aria-label="Case Insensitive (i)" type="checkbox" />
      <input aria-label="Multiline (m)" type="checkbox" />
      <textarea
        aria-label="Test String"
        value={testStr}
        onChange={e => setTestStr(e.target.value)}
      />
      <button>Test</button>
      <p data-testid="match-count"></p>
      <div data-testid="result-area"></div>
      <ul></ul>
    </div>
  )
}
