'use client'
import { useState } from 'react'

export default function App() {
  const [input, setInput] = useState('')
  const [output] = useState('')

  return (
    <div>
      <h1>JSON Formatter</h1>
      <textarea
        aria-label="Input JSON"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <p data-testid="status"></p>
      <select aria-label="Indent">
        <option value="2 spaces">2 spaces</option>
        <option value="4 spaces">4 spaces</option>
        <option value="Tab">Tab</option>
      </select>
      <button>Format</button>
      <button>Minify</button>
      <button>Clear</button>
      <textarea aria-label="Output JSON" readOnly value={output} />
      <button>Copy Output</button>
    </div>
  )
}
