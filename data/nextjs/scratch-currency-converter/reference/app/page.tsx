'use client'
import { useState } from 'react'

interface Currency {
  code: string
  name: string
  rate: number
}

interface HistoryEntry {
  id: number
  fromAmount: number
  fromCode: string
  toAmount: number
  toCode: string
  time: string
}

const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', rate: 1.00 },
  { code: 'EUR', name: 'Euro', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', rate: 149.50 },
  { code: 'CAD', name: 'Canadian Dollar', rate: 1.36 },
  { code: 'AUD', name: 'Australian Dollar', rate: 1.53 },
]

const SEED_HISTORY: HistoryEntry[] = [
  { id: 1, fromAmount: 100.00, fromCode: 'USD', toAmount: 92.00, toCode: 'EUR', time: '09:30' },
  { id: 2, fromAmount: 50.00, fromCode: 'GBP', toAmount: 7475.00, toCode: 'JPY', time: '10:15' },
]

export default function App() {
  const [amount, setAmount] = useState('')
  const [fromCode, setFromCode] = useState('USD')
  const [toCode, setToCode] = useState('EUR')
  const [result, setResult] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>(SEED_HISTORY.map(h => ({ ...h })))
  const [nextId, setNextId] = useState(3)

  function convert() {
    const val = parseFloat(amount)
    if (isNaN(val) || val <= 0) return

    const fromCurrency = CURRENCIES.find(c => c.code === fromCode)
    const toCurrency = CURRENCIES.find(c => c.code === toCode)
    if (!fromCurrency || !toCurrency) return

    const converted = parseFloat((val * (toCurrency.rate / fromCurrency.rate)).toFixed(2))
    setResult(`${val.toFixed(2)} ${fromCode} = ${converted.toFixed(2)} ${toCode}`)

    const now = new Date()
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    const entry: HistoryEntry = {
      id: nextId,
      fromAmount: val,
      fromCode,
      toAmount: converted,
      toCode,
      time,
    }
    setHistory(prev => [entry, ...prev])
    setNextId(n => n + 1)
  }

  function clearHistory() {
    setHistory([])
  }

  return (
    <div>
      <h1>Currency Converter</h1>

      <div>
        <label htmlFor="amount-input">Amount</label>
        <input
          id="amount-input"
          data-testid="amount-input"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <select
          data-testid="from-select"
          value={fromCode}
          onChange={e => setFromCode(e.target.value)}
        >
          {CURRENCIES.map(c => (
            <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
          ))}
        </select>

        <select
          data-testid="to-select"
          value={toCode}
          onChange={e => setToCode(e.target.value)}
        >
          {CURRENCIES.map(c => (
            <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
          ))}
        </select>

        <button data-testid="convert-btn" onClick={convert}>Convert</button>

        <div data-testid="result-display">
          {result ?? ''}
        </div>
      </div>

      <div>
        <h2>Conversion History</h2>
        <div data-testid="history-list">
          {history.map((entry, idx) => (
            <div key={entry.id} data-testid={`history-entry-${idx}`}>
              {entry.fromAmount.toFixed(2)} {entry.fromCode} = {entry.toAmount.toFixed(2)} {entry.toCode} [{entry.time}]
            </div>
          ))}
        </div>
        <button data-testid="clear-history-btn" onClick={clearHistory}>Clear History</button>
      </div>
    </div>
  )
}
