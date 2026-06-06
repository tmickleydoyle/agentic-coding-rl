'use client'
import { useState } from 'react'

const RATES: Record<string, number> = {
  Running: 10,
  Cycling: 8,
  Swimming: 9,
  'Jump Rope': 12,
  Walking: 4,
  Yoga: 3,
}

const ACTIVITIES = ['Running', 'Cycling', 'Swimming', 'Jump Rope', 'Walking', 'Yoga']

interface Entry {
  id: number
  activity: string
  duration: number
  calories: number
  date: string
}

const SEED: Entry[] = [
  { id: 1, activity: 'Running', duration: 30, calories: 300, date: '2024-03-01' },
  { id: 2, activity: 'Cycling', duration: 45, calories: 360, date: '2024-03-03' },
  { id: 3, activity: 'Swimming', duration: 20, calories: 180, date: '2024-03-05' },
]

let nextId = 4

export default function App() {
  const [entries, setEntries] = useState<Entry[]>(SEED.map(x => ({ ...x })))
  const [activity, setActivity] = useState('Running')
  const [duration, setDuration] = useState<string>('')
  const [date, setDate] = useState('2024-03-10')

  function add() {
    const dur = Number(duration)
    if (dur <= 0) return
    const calories = dur * RATES[activity]
    setEntries(es => [...es, { id: nextId++, activity, duration: dur, calories, date }])
    setDuration('')
  }

  function remove(id: number) {
    setEntries(es => es.filter(e => e.id !== id))
  }

  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0)
  const totalMinutes = entries.reduce((sum, e) => sum + e.duration, 0)

  return (
    <div>
      <h1>Calorie Burn Estimator</h1>

      <div>
        <select aria-label="Activity" value={activity} onChange={e => setActivity(e.target.value)}>
          {ACTIVITIES.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <input
          aria-label="Duration (minutes)"
          type="number"
          min={1}
          value={duration}
          onChange={e => setDuration(e.target.value)}
        />
        <input
          aria-label="Date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <button onClick={add} disabled={Number(duration) <= 0}>Add Workout</button>
      </div>

      {entries.length === 0 ? (
        <p data-testid="empty-message">No workouts logged.</p>
      ) : (
        <ul>
          {entries.map(e => (
            <li key={e.id} data-testid="workout-entry">
              <span data-testid="entry-activity">{e.activity}</span>
              <span data-testid="entry-duration">{e.duration} min</span>
              <span data-testid="entry-calories">{e.calories} cal</span>
              <span data-testid="entry-date">{e.date}</span>
              <button onClick={() => remove(e.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      <p data-testid="total-workouts">Workouts: {entries.length}</p>
      <p data-testid="total-calories">Total calories burned: {totalCalories}</p>
      <p data-testid="total-minutes">Total minutes: {totalMinutes}</p>
    </div>
  )
}
