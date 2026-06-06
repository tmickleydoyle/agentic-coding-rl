'use client'
import { useState } from 'react'

const GOAL = 2000

interface Entry {
  id: number
  time: string
  amount: number
}

const SEED: Entry[] = [
  { id: 1, time: '08:00 AM', amount: 250 },
  { id: 2, time: '12:30 PM', amount: 500 },
  { id: 3, time: '03:00 PM', amount: 330 },
]

function formatTime(raw: string): string {
  // raw is HH:MM from <input type="time">
  const [hStr, mStr] = raw.split(':')
  const h = parseInt(hStr, 10)
  const m = mStr
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${String(h12).padStart(2, '0')}:${m} ${period}`
}

export default function App() {
  const [entries, setEntries] = useState<Entry[]>(SEED.map(e => ({ ...e })))
  const [amount, setAmount] = useState('')
  const [time, setTime] = useState('')
  const [nextId, setNextId] = useState(SEED.length + 1)

  const total = entries.reduce((s, e) => s + e.amount, 0)
  const progress = Math.min(100, Math.round((total / GOAL) * 100))

  function handleLog() {
    const a = parseFloat(amount)
    if (!isFinite(a) || a <= 0) return
    if (!time.trim()) return
    const label = formatTime(time)
    setEntries(prev => [...prev, { id: nextId, time: label, amount: a }])
    setNextId(n => n + 1)
    setAmount('')
    setTime('')
  }

  function handleReset() {
    setEntries([])
  }

  return (
    <div>
      <h1>Water Tracker</h1>
      <p data-testid="total-intake">{total} ml</p>
      <p data-testid="daily-goal">Goal: {GOAL} ml</p>
      <progress data-testid="progress-bar" value={progress} max={100} />
      {total >= GOAL && <p data-testid="goal-reached">Goal reached!</p>}
      <ul>
        {entries.map(e => (
          <li key={e.id} data-testid="log-entry">
            {e.time} — {e.amount} ml
          </li>
        ))}
      </ul>
      <div>
        <label>
          Amount (ml)
          <input
            type="number"
            aria-label="Amount (ml)"
            value={amount}
            onChange={ev => setAmount(ev.target.value)}
          />
        </label>
        <label>
          Time
          <input
            type="time"
            aria-label="Time"
            value={time}
            onChange={ev => setTime(ev.target.value)}
          />
        </label>
        <button onClick={handleLog}>Log Water</button>
      </div>
      <button onClick={handleReset}>Reset Day</button>
    </div>
  )
}
