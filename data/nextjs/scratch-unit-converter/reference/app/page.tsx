'use client'
import { useState } from 'react'

type Category = 'Length' | 'Weight' | 'Temperature'

const LENGTH_UNITS: Record<string, number> = {
  mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, mi: 1609.344
}
const WEIGHT_UNITS: Record<string, number> = {
  mg: 0.000001, g: 0.001, kg: 1, oz: 0.0283495, lb: 0.453592
}
const TEMP_UNITS = ['°C', '°F', 'K']

const CATEGORY_UNITS: Record<Category, string[]> = {
  Length: Object.keys(LENGTH_UNITS),
  Weight: Object.keys(WEIGHT_UNITS),
  Temperature: TEMP_UNITS,
}

function convertLength(value: number, from: string, to: string): number {
  return (value * LENGTH_UNITS[from]) / LENGTH_UNITS[to]
}

function convertWeight(value: number, from: string, to: string): number {
  return (value * WEIGHT_UNITS[from]) / WEIGHT_UNITS[to]
}

function convertTemp(value: number, from: string, to: string): number {
  if (from === to) return value
  let celsius: number
  if (from === '°C') celsius = value
  else if (from === '°F') celsius = (value - 32) * 5 / 9
  else celsius = value - 273.15

  if (to === '°C') return celsius
  if (to === '°F') return celsius * 9 / 5 + 32
  return celsius + 273.15
}

function convert(category: Category, value: number, from: string, to: string): number {
  if (category === 'Length') return convertLength(value, from, to)
  if (category === 'Weight') return convertWeight(value, from, to)
  return convertTemp(value, from, to)
}

interface HistoryEntry {
  id: number
  text: string
}

export default function App() {
  const [category, setCategory] = useState<Category>('Length')
  const [from, setFrom] = useState('m')
  const [to, setTo] = useState('ft')
  const [value, setValue] = useState('')
  const [result, setResult] = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [nextId, setNextId] = useState(1)

  function handleTabClick(cat: Category) {
    setCategory(cat)
    const units = CATEGORY_UNITS[cat]
    setFrom(units[0])
    setTo(units[1])
    setResult('')
  }

  function handleConvert() {
    const num = parseFloat(value)
    if (!isFinite(num) || value.trim() === '') return
    const res = convert(category, num, from, to)
    const resStr = res.toFixed(4)
    setResult(resStr)
    const entry: HistoryEntry = {
      id: nextId,
      text: `${value} ${from} → ${to} = ${resStr}`,
    }
    setNextId(id => id + 1)
    setHistory(h => [entry, ...h].slice(0, 5))
  }

  function handleSwap() {
    setFrom(to)
    setTo(from)
    setResult('')
  }

  const units = CATEGORY_UNITS[category]

  return (
    <div>
      <h1>Unit Converter</h1>
      <div role="tablist">
        {(['Length', 'Weight', 'Temperature'] as Category[]).map(cat => (
          <button
            key={cat}
            role="tab"
            aria-selected={category === cat}
            onClick={() => handleTabClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div>
        <label>
          Value
          <input
            aria-label="Value"
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        </label>

        <label>
          From
          <select
            aria-label="From"
            value={from}
            onChange={e => setFrom(e.target.value)}
          >
            {units.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </label>

        <label>
          To
          <select
            aria-label="To"
            value={to}
            onChange={e => setTo(e.target.value)}
          >
            {units.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </label>

        <button onClick={handleConvert}>Convert</button>
        <button onClick={handleSwap}>Swap</button>
      </div>

      <p data-testid="result">{result}</p>

      <ul>
        {history.map(h => (
          <li key={h.id} data-testid="history-item">{h.text}</li>
        ))}
      </ul>
    </div>
  )
}
