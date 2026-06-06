'use client'
import { useState } from 'react'

function sieve(limit: number): boolean[] {
  // isPrime[i] = true means i is prime, indices 0..limit
  const isPrime = new Array(limit + 1).fill(true)
  isPrime[0] = false
  if (limit >= 1) isPrime[1] = false
  for (let p = 2; p * p <= limit; p++) {
    if (isPrime[p]) {
      for (let m = p * p; m <= limit; m += p) {
        isPrime[m] = false
      }
    }
  }
  return isPrime
}

interface HistoryEntry {
  id: number
  limit: number
  primeCount: number
}

const DEFAULT_LIMIT = 50

function runInitial() {
  return sieve(DEFAULT_LIMIT)
}

export default function App() {
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [isPrime, setIsPrime] = useState<boolean[]>(() => runInitial())
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [nextId, setNextId] = useState(1)
  const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT)

  function handleRunSieve() {
    const clampedLimit = Math.max(2, Math.min(1000, limit))
    const result = sieve(clampedLimit)
    setIsPrime(result)
    setCurrentLimit(clampedLimit)
    const primeCount = result.slice(2).filter(Boolean).length
    setHistory(h => [...h, { id: nextId, limit: clampedLimit, primeCount }])
    setNextId(n => n + 1)
  }

  function handleClear() {
    setHistory([])
  }

  const primes: number[] = []
  for (let i = 2; i <= currentLimit; i++) {
    if (isPrime[i]) primes.push(i)
  }
  const primeCount = primes.length
  const largestPrime = primes.length > 0 ? primes[primes.length - 1] : null
  const primeSum = primes.reduce((s, p) => s + p, 0)

  const cells: number[] = []
  for (let i = 2; i <= currentLimit; i++) cells.push(i)

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

      <button onClick={handleRunSieve}>Run Sieve</button>

      <div>
        <span>Primes found: </span><span data-testid="prime-count">{primeCount}</span>
        <span> Largest: </span><span data-testid="largest-prime">{largestPrime ?? '—'}</span>
        <span> Sum: </span><span data-testid="prime-sum">{primeSum}</span>
      </div>

      <div>
        {cells.map(n => (
          <span
            key={n}
            data-testid={isPrime[n] ? 'prime-cell' : 'composite-cell'}
          >
            <span data-testid="number-cell">{n}</span>
          </span>
        ))}
      </div>

      <button onClick={handleClear}>Clear History</button>

      <ul>
        {history.map(entry => (
          <li key={entry.id} data-testid="history-entry">
            Limit: {entry.limit}, Primes: {entry.primeCount}
          </li>
        ))}
      </ul>
    </div>
  )
}
