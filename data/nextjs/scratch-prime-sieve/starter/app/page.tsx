'use client'
import { useState } from 'react'

export default function App() {
  const [limit, setLimit] = useState(50)

  return (
    <div>
      <h1>Prime Sieve</h1>
      <div>
        <label htmlFor="upper-limit">Upper Limit</label>
        <input
          id="upper-limit"
          type="number"
          min={2}
          max={1000}
          value={limit}
          onChange={e => setLimit(Number(e.target.value))}
        />
      </div>
      <button onClick={() => {}}>Run Sieve</button>
      <div>
        <span>Primes found: </span><span data-testid="prime-count">0</span>
        <span> Largest: </span><span data-testid="largest-prime">—</span>
        <span> Sum: </span><span data-testid="prime-sum">0</span>
      </div>
      <div></div>
      <button onClick={() => {}}>Clear History</button>
      <ul></ul>
    </div>
  )
}
