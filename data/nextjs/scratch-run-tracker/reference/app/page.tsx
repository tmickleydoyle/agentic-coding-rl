'use client'
import { useState } from 'react'

interface Run {
  id: number
  date: string
  distance: number
  duration: number
  notes: string
}

const SEED: Run[] = [
  { id: 1, date: '2024-03-01', distance: 3.1, duration: 28, notes: 'Easy morning run' },
  { id: 2, date: '2024-03-05', distance: 6.2, duration: 58, notes: 'Long run' },
  { id: 3, date: '2024-03-08', distance: 2.0, duration: 20, notes: 'Recovery run' },
]

let nextId = 4

function formatPace(durationMin: number, distanceMiles: number): string {
  const paceMin = durationMin / distanceMiles
  const totalSeconds = Math.floor(paceMin * 60)
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')} /mi`
}

export default function App() {
  const [runs, setRuns] = useState<Run[]>(SEED.map(x => ({ ...x })))
  const [date, setDate] = useState('2024-03-15')
  const [distance, setDistance] = useState<string>('')
  const [duration, setDuration] = useState<string>('')
  const [notes, setNotes] = useState('')

  function log() {
    const d = Number(distance)
    const dur = Number(duration)
    if (d <= 0 || dur <= 0) return
    setRuns(rs => [...rs, { id: nextId++, date, distance: d, duration: dur, notes }])
    setDistance('')
    setDuration('')
    setNotes('')
  }

  function del(id: number) {
    setRuns(rs => rs.filter(r => r.id !== id))
  }

  const sorted = [...runs].sort((a, b) => b.date.localeCompare(a.date))

  const totalDistance = runs.reduce((sum, r) => sum + r.distance, 0)
  const totalDuration = runs.reduce((sum, r) => sum + r.duration, 0)
  const avgPace = runs.length > 0 ? formatPace(totalDuration, totalDistance) : '—'

  const canLog = Number(distance) > 0 && Number(duration) > 0

  return (
    <div>
      <h1>Run Tracker</h1>

      <div>
        <input
          aria-label="Date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <input
          aria-label="Distance (miles)"
          type="number"
          min={0.1}
          step={0.1}
          value={distance}
          onChange={e => setDistance(e.target.value)}
        />
        <input
          aria-label="Duration (minutes)"
          type="number"
          min={1}
          value={duration}
          onChange={e => setDuration(e.target.value)}
        />
        <input
          aria-label="Notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <button onClick={log} disabled={!canLog}>Log Run</button>
      </div>

      {runs.length === 0 ? (
        <p data-testid="empty-message">No runs logged.</p>
      ) : (
        <ul>
          {sorted.map(r => (
            <li key={r.id} data-testid="run-item">
              <span data-testid="run-date">{r.date}</span>
              <span data-testid="run-distance">{r.distance} mi</span>
              <span data-testid="run-duration">{r.duration} min</span>
              <span data-testid="run-pace">{formatPace(r.duration, r.distance)}</span>
              <button onClick={() => del(r.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <p data-testid="total-runs">Runs: {runs.length}</p>
      <p data-testid="total-distance">Distance: {totalDistance.toFixed(1)} mi</p>
      <p data-testid="avg-pace">Avg pace: {avgPace}</p>
    </div>
  )
}
