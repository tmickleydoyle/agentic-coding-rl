'use client'
import { useState } from 'react'

const TEST_CASES = [
  { id: 1, name: 'adds two positive numbers', fn: () => 1 + 2 === 3 },
  { id: 2, name: 'subtracts numbers correctly', fn: () => 10 - 4 === 6 },
  { id: 3, name: 'multiplies correctly', fn: () => 3 * 4 === 12 },
  { id: 4, name: 'divides correctly', fn: () => 8 / 2 === 4 },
  { id: 5, name: 'handles zero addition', fn: () => 0 + 0 === 0 },
  { id: 6, name: 'always fails (intentional)', fn: () => 1 === 2 },
]

export default function App() {
  const [_ran, _setRan] = useState(false)

  return (
    <div>
      <h1>Unit Test Runner</h1>
      <button>Run All Tests</button>
      <ul>
        {TEST_CASES.map(tc => (
          <li key={tc.id} data-testid="test-row">
            <span data-testid="test-name">{tc.name}</span>
            <span data-testid="test-status">pending</span>
          </li>
        ))}
      </ul>
      <p data-testid="summary"></p>
    </div>
  )
}
