'use client'
import { useState, useEffect, useRef } from 'react'

interface LogEntry {
  id: number
  book: string
  minutes: number
  date: string
}

const SEED: LogEntry[] = [
  { id: 1, book: 'Dune', minutes: 30, date: '2024-01-10' },
  { id: 2, book: 'Foundation', minutes: 45, date: '2024-01-11' },
]

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${pad(m)}:${pad(s)}`
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function App() {
  const [log, setLog] = useState<LogEntry[]>(SEED.map(e => ({ ...e })))
  const [bookInput, setBookInput] = useState('')
  const [minutesInput, setMinutesInput] = useState('')
  const [nextId, setNextId] = useState(3)

  const [activeBook, setActiveBook] = useState('')
  const [activeMinutes, setActiveMinutes] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function finishSession(book: string, minutes: number) {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    setLog(l => [...l, { id: nextId, book, minutes, date: todayStr() }])
    setNextId(n => n + 1)
    setActiveBook('')
    setActiveMinutes(0)
    setRemaining(0)
  }

  useEffect(() => {
    if (!isRunning) return
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  useEffect(() => {
    if (isRunning && remaining === 0) {
      finishSession(activeBook, activeMinutes)
    }
  }, [remaining, isRunning])

  function startSession() {
    if (!bookInput.trim()) return
    const mins = parseInt(minutesInput, 10)
    if (!mins || mins < 1) return
    setActiveBook(bookInput.trim())
    setActiveMinutes(mins)
    setRemaining(mins * 60)
    setIsRunning(true)
    setBookInput('')
    setMinutesInput('')
  }

  function finishEarly() {
    finishSession(activeBook, activeMinutes)
  }

  function deleteEntry(id: number) {
    setLog(l => l.filter(e => e.id !== id))
  }

  const total = log.reduce((s, e) => s + e.minutes, 0)

  return (
    <div>
      <h1>Reading Timer</h1>

      <div>
        <input
          aria-label="Book Title"
          value={bookInput}
          onChange={e => setBookInput(e.target.value)}
          disabled={isRunning}
        />
        <input
          aria-label="Minutes"
          type="number"
          min={1}
          value={minutesInput}
          onChange={e => setMinutesInput(e.target.value)}
          disabled={isRunning}
        />
        <button onClick={startSession} disabled={isRunning}>Start Session</button>
      </div>

      {isRunning && (
        <div data-testid="active-session">
          <span data-testid="session-book">{activeBook}</span>
          <span data-testid="timer-display">{formatTime(remaining)}</span>
          <button onClick={finishEarly}>Finish Early</button>
        </div>
      )}

      <ul>
        {log.map(e => (
          <li key={e.id} data-testid="log-item">
            <span data-testid="log-book">{e.book}</span>
            <span data-testid="log-minutes">{e.minutes} min</span>
            <span data-testid="log-date">{e.date}</span>
            <button onClick={() => deleteEntry(e.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <p data-testid="total-minutes">Total: {total} min</p>
    </div>
  )
}
