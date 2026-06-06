'use client'
import { useState } from 'react'

const ROMAN_MAP: [string, number][] = [
  ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
  ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
  ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1],
]

function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 3999) return ''
  let result = ''
  let remaining = n
  for (const [sym, val] of ROMAN_MAP) {
    while (remaining >= val) {
      result += sym
      remaining -= val
    }
  }
  return result
}

function fromRoman(s: string): number {
  const upper = s.toUpperCase()
  if (!/^[IVXLCDM]+$/.test(upper)) return -1
  const vals: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let total = 0
  for (let i = 0; i < upper.length; i++) {
    const cur = vals[upper[i]]
    const next = vals[upper[i + 1]]
    if (next && cur < next) {
      total -= cur
    } else {
      total += cur
    }
  }
  return total
}

interface HistoryEntry {
  id: number
  from: string
  to: string
}

export default function App() {
  const [mode, setMode] = useState<'toRoman' | 'fromRoman'>('toRoman')
  const [input, setInput] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [nextId, setNextId] = useState(1)

  function handleModeChange(newMode: 'toRoman' | 'fromRoman') {
    setMode(newMode)
    setInput('')
    setResult(null)
  }

  function handleConvert() {
    if (mode === 'toRoman') {
      const n = Number(input)
      if (!input.trim() || !Number.isInteger(n) || n < 1 || n > 3999) {
        setResult('Invalid input')
        return
      }
      const roman = toRoman(n)
      setResult(roman)
      setHistory(h => [...h, { id: nextId, from: input.trim(), to: roman }])
      setNextId(id => id + 1)
    } else {
      if (!input.trim() || !/^[IVXLCDMivxlcdm]+$/.test(input.trim())) {
        setResult('Invalid input')
        return
      }
      const val = fromRoman(input.trim())
      if (val < 1 || val > 3999) {
        setResult('Invalid input')
        return
      }
      const canonical = toRoman(val)
      if (canonical.toLowerCase() !== input.trim().toLowerCase()) {
        setResult('Invalid input')
        return
      }
      setResult(String(val))
      setHistory(h => [...h, { id: nextId, from: input.trim().toUpperCase(), to: String(val) }])
      setNextId(id => id + 1)
    }
  }

  function handleClear() {
    setHistory([])
  }

  return (
    <div>
      <h1>Roman Numeral Converter</h1>

      <div>
        <label>
          <input
            type="radio"
            name="mode"
            checked={mode === 'toRoman'}
            onChange={() => handleModeChange('toRoman')}
          />
          Integer → Roman
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            checked={mode === 'fromRoman'}
            onChange={() => handleModeChange('fromRoman')}
          />
          Roman → Integer
        </label>
      </div>

      {mode === 'toRoman' ? (
        <div>
          <label htmlFor="integer-input">Integer</label>
          <input
            id="integer-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>
      ) : (
        <div>
          <label htmlFor="roman-input">Roman Numeral</label>
          <input
            id="roman-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>
      )}

      <button onClick={handleConvert}>Convert</button>

      <p>Result: <span data-testid="conversion-result">{result ?? '—'}</span></p>

      <button onClick={handleClear}>Clear History</button>

      <ul>
        {history.map(entry => (
          <li key={entry.id} data-testid="history-entry">
            {entry.from} → {entry.to}
          </li>
        ))}
      </ul>
    </div>
  )
}
