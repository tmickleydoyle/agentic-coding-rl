'use client'
import { useState } from 'react'

export default function App() {
  const [token, setToken] = useState('')
  const [stack] = useState<number[]>([])

  return (
    <div>
      <h1>RPN Calculator</h1>
      <div>
        <label htmlFor="token-input">Token</label>
        <input
          id="token-input"
          type="text"
          value={token}
          onChange={e => setToken(e.target.value)}
        />
        <button onClick={() => {}}>Push</button>
      </div>
      <div>
        <p>Last result: <span data-testid="last-result">—</span></p>
        <p data-testid="error-message"></p>
      </div>
      <div>
        <p>Stack depth: <span data-testid="stack-depth">0</span></p>
        <ul>
          {stack.map((val, idx) => (
            <li key={idx} data-testid="stack-item">{val}</li>
          ))}
        </ul>
      </div>
      <button onClick={() => {}}>Clear Stack</button>
      <button onClick={() => {}}>Clear History</button>
      <ul></ul>
    </div>
  )
}
