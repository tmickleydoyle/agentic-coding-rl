'use client'
import { useState } from 'react'

interface Record {
  id: number
  exercise: string
  weight: number
  unit: string
  date: string
}

const SEED: Record[] = [
  { id: 1, exercise: 'Bench Press', weight: 185, unit: 'lbs', date: '2024-01-15' },
  { id: 2, exercise: 'Squat', weight: 225, unit: 'lbs', date: '2024-02-20' },
  { id: 3, exercise: 'Deadlift', weight: 275, unit: 'lbs', date: '2024-03-10' },
  { id: 4, exercise: 'Overhead Press', weight: 115, unit: 'lbs', date: '2024-01-28' },
]

let nextId = 5

export default function App() {
  const [records, setRecords] = useState<Record[]>(SEED.map(x => ({ ...x })))
  const [exercise, setExercise] = useState('')
  const [weight, setWeight] = useState<string>('')
  const [unit, setUnit] = useState('lbs')
  const [date, setDate] = useState('2024-04-01')

  function save() {
    const w = Number(weight)
    if (!exercise.trim() || w <= 0) return
    setRecords(rs => [...rs, { id: nextId++, exercise: exercise.trim(), weight: w, unit, date }])
    setExercise('')
    setWeight('')
  }

  function del(id: number) {
    setRecords(rs => rs.filter(r => r.id !== id))
  }

  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date))

  let heaviest = '—'
  if (records.length > 0) {
    const h = records.reduce((best, r) => r.weight > best.weight ? r : best, records[0])
    heaviest = `${h.weight} ${h.unit}`
  }

  const latestDate = records.length > 0
    ? records.reduce((best, r) => r.date > best ? r.date : best, records[0].date)
    : '—'

  const canSave = exercise.trim().length > 0 && Number(weight) > 0

  return (
    <div>
      <h1>Personal Records</h1>

      <div>
        <input
          aria-label="Exercise"
          value={exercise}
          onChange={e => setExercise(e.target.value)}
        />
        <input
          aria-label="Weight"
          type="number"
          min={1}
          value={weight}
          onChange={e => setWeight(e.target.value)}
        />
        <select aria-label="Unit" value={unit} onChange={e => setUnit(e.target.value)}>
          <option value="lbs">lbs</option>
          <option value="kg">kg</option>
        </select>
        <input
          aria-label="Date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <button onClick={save} disabled={!canSave}>Save Record</button>
      </div>

      {records.length === 0 ? (
        <p data-testid="empty-message">No records yet.</p>
      ) : (
        <ul>
          {sorted.map(r => (
            <li key={r.id} data-testid="record-row">
              <span data-testid="record-exercise">{r.exercise}</span>
              <span data-testid="record-weight">{r.weight} {r.unit}</span>
              <span data-testid="record-date">{r.date}</span>
              <button onClick={() => del(r.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <p data-testid="record-count">Records: {records.length}</p>
      <p data-testid="heaviest-lift">Heaviest: {heaviest}</p>
      <p data-testid="latest-date">Latest: {latestDate}</p>
    </div>
  )
}
