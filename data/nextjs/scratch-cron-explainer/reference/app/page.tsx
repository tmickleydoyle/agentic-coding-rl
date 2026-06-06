'use client'
import { useState } from 'react'

const SEED = '0 9 * * 1-5'

function explainMinute(t: string): string {
  if (t === '*') return 'every minute'
  if (/^\d+$/.test(t)) return `at minute ${t}`
  if (/^\d+-\d+$/.test(t)) { const [a, b] = t.split('-'); return `minutes ${a} to ${b}` }
  if (/^\*\/\d+$/.test(t)) return `every ${t.split('/')[1]} minutes`
  return t
}

function explainHour(t: string): string {
  if (t === '*') return 'every hour'
  if (/^\d+$/.test(t)) return `at hour ${t}`
  if (/^\d+-\d+$/.test(t)) { const [a, b] = t.split('-'); return `hours ${a} to ${b}` }
  if (/^\*\/\d+$/.test(t)) return `every ${t.split('/')[1]} hours`
  return t
}

function explainDom(t: string): string {
  if (t === '*') return 'every day'
  if (/^\d+$/.test(t)) return `on day ${t}`
  return t
}

function explainMonth(t: string): string {
  if (t === '*') return 'every month'
  if (/^\d+$/.test(t)) return `in month ${t}`
  return t
}

function explainDow(t: string): string {
  if (t === '*') return 'every day of the week'
  if (/^\d+$/.test(t)) return `on weekday ${t}`
  if (/^\d+-\d+$/.test(t)) { const [a, b] = t.split('-'); return `weekdays ${a} to ${b}` }
  return t
}

interface Parsed {
  fields: string[]
  summary: string
}

export default function App() {
  const [input, setInput] = useState(SEED)
  const [result, setResult] = useState<Parsed | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [show, setShow] = useState(false)

  function explain() {
    const fields = input.trim().split(/\s+/)
    if (fields.length !== 5) {
      setError('Invalid cron expression (need 5 fields)')
      setResult(null)
      setShow(true)
      return
    }
    setError(null)
    const summary = [
      explainMinute(fields[0]),
      explainHour(fields[1]),
      explainDom(fields[2]),
      explainMonth(fields[3]),
      explainDow(fields[4]),
    ].join(', ')
    setResult({ fields, summary })
    setShow(true)
  }

  function reset() {
    setInput(SEED)
    setResult(null)
    setError(null)
    setShow(false)
  }

  return (
    <div>
      <h1>Cron Explainer</h1>
      <div>
        <input
          aria-label="Cron Expression"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>
      <button onClick={explain}>Explain</button>
      <button onClick={reset}>Reset</button>

      {show && (
        <div data-testid="results">
          {error && <p data-testid="cron-error">{error}</p>}
          {result && (
            <>
              <p data-testid="cron-summary">{result.summary}</p>
              <table>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Minute</td><td data-testid="field-minute">{result.fields[0]}</td></tr>
                  <tr><td>Hour</td><td data-testid="field-hour">{result.fields[1]}</td></tr>
                  <tr><td>Day of Month</td><td data-testid="field-dom">{result.fields[2]}</td></tr>
                  <tr><td>Month</td><td data-testid="field-month">{result.fields[3]}</td></tr>
                  <tr><td>Day of Week</td><td data-testid="field-dow">{result.fields[4]}</td></tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  )
}
