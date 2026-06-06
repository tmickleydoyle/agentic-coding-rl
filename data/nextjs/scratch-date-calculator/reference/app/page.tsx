'use client'
import { useState } from 'react'

type Mode = 'difference' | 'addsubtract'

function parseDate(s: string): Date | null {
  if (!s) return null
  const d = new Date(s + 'T00:00:00')
  return isNaN(d.getTime()) ? null : d
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function App() {
  const [mode, setMode] = useState<Mode>('difference')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [baseDate, setBaseDate] = useState('')
  const [days, setDays] = useState('')

  function switchMode(m: Mode) {
    setMode(m)
    setStartDate('')
    setEndDate('')
    setBaseDate('')
    setDays('')
  }

  function reset() {
    setStartDate('')
    setEndDate('')
    setBaseDate('')
    setDays('')
  }

  // Difference mode calculations
  let diffDays: number | null = null
  const s = parseDate(startDate)
  const e = parseDate(endDate)
  if (s && e) {
    diffDays = Math.abs(Math.round((e.getTime() - s.getTime()) / 86400000))
  }

  const diffWeeks = diffDays !== null ? Math.floor(diffDays / 7) : null
  const diffRemainder = diffDays !== null ? diffDays % 7 : null
  const diffSummary =
    diffDays !== null
      ? `${diffDays} days (${diffWeeks} weeks, ${diffRemainder} days)`
      : '--'

  // Add/subtract mode calculation
  let resultDate: string = '--'
  const bd = parseDate(baseDate)
  const daysNum = parseInt(days, 10)
  if (bd && isFinite(daysNum)) {
    const result = new Date(bd.getTime() + daysNum * 86400000)
    resultDate = formatDate(result)
  }

  return (
    <div>
      <h1>Date Calculator</h1>

      <div>
        <button onClick={() => switchMode('difference')}>Difference</button>
        <button onClick={() => switchMode('addsubtract')}>Add / Subtract</button>
      </div>

      {mode === 'difference' ? (
        <div>
          <div>
            <label htmlFor="start-date">Start Date</label>
            <input
              id="start-date"
              aria-label="Start Date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="end-date">End Date</label>
            <input
              id="end-date"
              aria-label="End Date"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          <div>
            <span>Days:</span>
            <span data-testid="diff-days">{diffDays !== null ? String(diffDays) : '--'}</span>
          </div>
          <div>
            <span>Weeks:</span>
            <span data-testid="diff-weeks">
              {diffDays !== null ? `${diffWeeks} weeks ${diffRemainder} days` : '--'}
            </span>
          </div>
          <div>
            <span>Summary:</span>
            <span data-testid="diff-summary">{diffSummary}</span>
          </div>
        </div>
      ) : (
        <div>
          <div>
            <label htmlFor="base-date">Base Date</label>
            <input
              id="base-date"
              aria-label="Base Date"
              type="date"
              value={baseDate}
              onChange={e => setBaseDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="days-input">Days</label>
            <input
              id="days-input"
              aria-label="Days"
              type="number"
              value={days}
              onChange={e => setDays(e.target.value)}
            />
          </div>
          <div>
            <span>Result Date:</span>
            <span data-testid="result-date">{resultDate}</span>
          </div>
        </div>
      )}

      <button onClick={reset}>Reset</button>
    </div>
  )
}
