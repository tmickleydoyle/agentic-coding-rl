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

type Status = 'pending' | 'pass' | 'fail'

export default function App() {
  const [statuses, setStatuses] = useState<Status[]>(TEST_CASES.map(() => 'pending'))
  const [ran, setRan] = useState(false)
  const [summary, setSummary] = useState('')

  function handleRun() {
    const results = TEST_CASES.map(tc => tc.fn() ? 'pass' : 'fail') as Status[]
    setStatuses(results)
    const passed = results.filter(r => r === 'pass').length
    const failed = results.filter(r => r === 'fail').length
    setSummary(`${passed} passed, ${failed} failed`)
    setRan(true)
  }

  function handleReset() {
    setStatuses(TEST_CASES.map(() => 'pending'))
    setSummary('')
    setRan(false)
  }

  return (
    <div>
      <h1>Unit Test Runner</h1>
      {!ran && <button onClick={handleRun}>Run All Tests</button>}
      {ran && <button onClick={handleReset}>Reset</button>}
      <ul>
        {TEST_CASES.map((tc, i) => (
          <li key={tc.id} data-testid="test-row">
            <span data-testid="test-name">{tc.name}</span>
            <span data-testid="test-status">{statuses[i]}</span>
          </li>
        ))}
      </ul>
      <p data-testid="summary">{summary}</p>
    </div>
  )
}
