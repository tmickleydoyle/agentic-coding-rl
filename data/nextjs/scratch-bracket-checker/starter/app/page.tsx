'use client'
import { useState } from 'react'

export default function App() {
  const [expression, setExpression] = useState('')

  return (
    <div>
      <h1>Bracket Checker</h1>
      <div>
        <label htmlFor="expression">Expression</label>
        <textarea
          id="expression"
          placeholder="Enter expression..."
          value={expression}
          onChange={e => setExpression(e.target.value)}
        />
      </div>
      <button onClick={() => {}}>Check</button>
      <div>
        <p>Result: <span data-testid="check-result">—</span></p>
        <p>Characters: <span data-testid="char-count">{expression.length}</span></p>
        <p>Brackets: <span data-testid="bracket-count">0</span></p>
      </div>
      <button onClick={() => {}}>Clear History</button>
      <ul></ul>
    </div>
  )
}
