'use client'
import { useState } from 'react'

type Booking = { id: number; title: string; start: number; dur: number }

const OPEN = 540 // 09:00 in minutes
const CLOSE = 1020 // 17:00 in minutes
const TOTAL_SLOTS = (CLOSE - OPEN) / 30 // 16

function fmt(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
function parse(str: string) {
  const [h, m] = str.split(':').map(Number)
  return h * 60 + m
}
function slotsFor(start: number, dur: number): number[] {
  const out: number[] = []
  const startIdx = (start - OPEN) / 30
  for (let i = 0; i < dur / 30; i++) out.push(startIdx + i)
  return out
}

const STARTS: string[] = []
for (let t = OPEN; t <= CLOSE - 30; t += 30) STARTS.push(fmt(t))

export default function App() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [title, setTitle] = useState('')
  const [startStr, setStartStr] = useState(STARTS[0])
  const [durStr, setDurStr] = useState('30')
  const [error, setError] = useState('')
  const [nextId, setNextId] = useState(1)

  const covered = new Set<number>()
  bookings.forEach((b) => slotsFor(b.start, b.dur).forEach((s) => covered.add(s)))
  const free = TOTAL_SLOTS - covered.size

  function book() {
    if (title.trim() === '') {
      setError('Title is required')
      return
    }
    const start = parse(startStr)
    const dur = Number(durStr)
    if (start + dur > CLOSE) {
      setError('Booking runs past closing time')
      return
    }
    const wanted = slotsFor(start, dur)
    if (wanted.some((s) => covered.has(s))) {
      setError('That time overlaps an existing booking')
      return
    }
    setBookings((bs) => [...bs, { id: nextId, title: title.trim(), start, dur }])
    setNextId((n) => n + 1)
    setTitle('')
    setError('')
  }

  function cancel(id: number) {
    setBookings((bs) => bs.filter((b) => b.id !== id))
  }

  const sorted = [...bookings].sort((a, b) => a.start - b.start)

  return (
    <div>
      <h1>Day Scheduler</h1>

      <section aria-label="New booking">
        <input aria-label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select aria-label="Start time" value={startStr} onChange={(e) => setStartStr(e.target.value)}>
          {STARTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select aria-label="Duration" value={durStr} onChange={(e) => setDurStr(e.target.value)}>
          <option value="30">30 minutes</option>
          <option value="60">60 minutes</option>
        </select>
        <button onClick={book}>Book</button>
        {error !== '' && <p role="alert">{error}</p>}
      </section>

      <p>{`Free slots: ${free}`}</p>

      <section aria-label="Bookings">
        <ul>
          {sorted.map((b) => (
            <li key={b.id}>
              <span>{`${b.title} ${fmt(b.start)} - ${fmt(b.start + b.dur)}`}</span>
              <button aria-label={`Cancel ${b.title}`} onClick={() => cancel(b.id)}>
                Cancel
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
