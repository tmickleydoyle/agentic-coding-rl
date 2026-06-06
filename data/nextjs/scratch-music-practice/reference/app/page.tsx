'use client'
import { useState } from 'react'

interface Session {
  id: number
  instrument: string
  date: string
  duration: number
  notes: string
}

const SEED: Session[] = [
  { id: 1, instrument: 'Guitar', date: '2024-01-15', duration: 45, notes: 'Scales and arpeggios' },
  { id: 2, instrument: 'Piano', date: '2024-01-15', duration: 30, notes: 'Bach Inventions' },
  { id: 3, instrument: 'Guitar', date: '2024-01-16', duration: 60, notes: 'Chord transitions' },
  { id: 4, instrument: 'Drums', date: '2024-01-17', duration: 20, notes: 'Rudiments practice' },
  { id: 5, instrument: 'Piano', date: '2024-01-18', duration: 50, notes: 'Chopin Etude' },
]

export default function App() {
  const [sessions, setSessions] = useState<Session[]>(SEED.map(s => ({ ...s })))
  const [instrument, setInstrument] = useState('')
  const [date, setDate] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [filter, setFilter] = useState('')

  const handleAdd = () => {
    const dur = parseInt(duration, 10)
    if (!instrument.trim() || !dur) return
    const newId = sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 : 1
    setSessions([...sessions, { id: newId, instrument: instrument.trim(), date, duration: dur, notes }])
    setInstrument('')
    setDate('')
    setDuration('')
    setNotes('')
  }

  const handleDelete = (id: number) => {
    setSessions(sessions.filter(s => s.id !== id))
  }

  const filteredSessions = filter
    ? sessions.filter(s => s.instrument.toLowerCase().includes(filter.toLowerCase()))
    : sessions

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0)

  const topInstrument = (() => {
    if (sessions.length === 0) return 'None'
    const totals: Record<string, number> = {}
    sessions.forEach(s => {
      totals[s.instrument] = (totals[s.instrument] || 0) + s.duration
    })
    let best = ''
    let bestVal = -1
    Object.keys(totals).forEach(k => {
      if (totals[k] > bestVal) {
        bestVal = totals[k]
        best = k
      }
    })
    return best
  })()

  return (
    <div>
      <h1>Music Practice Tracker</h1>

      <div>
        <h2>Add Session</h2>
        <input
          aria-label="Instrument"
          placeholder="Instrument"
          value={instrument}
          onChange={e => setInstrument(e.target.value)}
          data-testid="input-instrument"
        />
        <input
          type="date"
          aria-label="Date"
          value={date}
          onChange={e => setDate(e.target.value)}
          data-testid="input-date"
        />
        <input
          type="number"
          aria-label="Duration"
          placeholder="Duration (min)"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          data-testid="input-duration"
        />
        <input
          aria-label="Notes"
          placeholder="Notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          data-testid="input-notes"
        />
        <button onClick={handleAdd} data-testid="btn-add">Add Session</button>
      </div>

      <div>
        <h2>Stats</h2>
        <div data-testid="stat-total-sessions">{sessions.length}</div>
        <div data-testid="stat-total-minutes">{totalMinutes}</div>
        <div data-testid="stat-top-instrument">{topInstrument}</div>
      </div>

      <div>
        <h2>Filter</h2>
        <input
          aria-label="Filter by instrument"
          placeholder="Filter by instrument"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          data-testid="input-filter"
        />
      </div>

      <ul data-testid="session-list">
        {filteredSessions.map(s => (
          <li key={s.id} data-testid={`session-item-${s.id}`}>
            <span data-testid={`session-instrument-${s.id}`}>{s.instrument}</span>
            <span data-testid={`session-date-${s.id}`}>{s.date}</span>
            <span data-testid={`session-duration-${s.id}`}>{s.duration} min</span>
            <span data-testid={`session-notes-${s.id}`}>{s.notes}</span>
            <button onClick={() => handleDelete(s.id)} data-testid={`delete-btn-${s.id}`}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
