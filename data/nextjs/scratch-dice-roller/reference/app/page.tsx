'use client'
import { useState } from 'react'

const DIE_TYPES = [4, 6, 8, 10, 12, 20] as const
type DieType = typeof DIE_TYPES[number]

interface RollEntry {
  id: number
  dieType: DieType
  count: number
  results: number[]
  sum: number
}

function rollDie(sides: DieType): number {
  return Math.floor(Math.random() * sides) + 1
}

export default function App() {
  const [dieType, setDieType] = useState<DieType>(6)
  const [numDice, setNumDice] = useState(2)
  const [history, setHistory] = useState<RollEntry[]>([])
  const [lastRoll, setLastRoll] = useState<RollEntry | null>(null)
  const [nextId, setNextId] = useState(1)

  function handleRoll() {
    const count = Math.max(1, Math.min(10, numDice))
    const results: number[] = []
    for (let i = 0; i < count; i++) {
      results.push(rollDie(dieType))
    }
    const sum = results.reduce((s, x) => s + x, 0)
    const entry: RollEntry = { id: nextId, dieType, count, results, sum }
    setNextId(n => n + 1)
    setLastRoll(entry)
    setHistory(h => [...h, entry])
  }

  function handleClear() {
    setHistory([])
    setLastRoll(null)
  }

  return (
    <div>
      <h1>Dice Roller</h1>

      <div>
        <label htmlFor="die-type">Die Type</label>
        <select
          id="die-type"
          value={dieType}
          onChange={e => setDieType(Number(e.target.value) as DieType)}
        >
          {DIE_TYPES.map(d => (
            <option key={d} value={d}>d{d}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="num-dice">Number of Dice</label>
        <input
          id="num-dice"
          type="number"
          min={1}
          max={10}
          value={numDice}
          onChange={e => setNumDice(Number(e.target.value))}
        />
      </div>

      <button onClick={handleRoll}>Roll</button>

      <div>
        <p>Results: <span data-testid="last-roll-results">{lastRoll ? lastRoll.results.join(', ') : '—'}</span></p>
        <p>Sum: <span data-testid="last-roll-sum">{lastRoll ? lastRoll.sum : '—'}</span></p>
        <p>Count: <span data-testid="last-roll-count">{lastRoll ? lastRoll.count : '—'}</span></p>
      </div>

      <button onClick={handleClear}>Clear History</button>

      <ul>
        {history.map(entry => (
          <li key={entry.id} data-testid="history-entry">
            d{entry.dieType} x{entry.count}: [{entry.results.join(', ')}] = {entry.sum}
          </li>
        ))}
      </ul>
    </div>
  )
}
