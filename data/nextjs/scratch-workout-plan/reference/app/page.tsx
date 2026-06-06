'use client'
import { useState } from 'react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

interface Exercise {
  id: number
  name: string
  sets: number
  reps: number
  day: string
}

const SEED: Exercise[] = [
  { id: 1, name: 'Push-ups', sets: 3, reps: 15, day: 'Monday' },
  { id: 2, name: 'Squats', sets: 4, reps: 12, day: 'Monday' },
  { id: 3, name: 'Pull-ups', sets: 3, reps: 8, day: 'Wednesday' },
]

let nextId = 4

export default function App() {
  const [exercises, setExercises] = useState<Exercise[]>(SEED.map(x => ({ ...x })))
  const [name, setName] = useState('')
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState(10)
  const [day, setDay] = useState('Monday')

  function add() {
    if (!name.trim()) return
    setExercises(xs => [...xs, { id: nextId++, name: name.trim(), sets, reps, day }])
    setName('')
    setSets(3)
    setReps(10)
    setDay('Monday')
  }

  function remove(id: number) {
    setExercises(xs => xs.filter(x => x.id !== id))
  }

  const totalSets = exercises.reduce((sum, x) => sum + x.sets, 0)

  const byDay = DAYS.map(d => ({ day: d, items: exercises.filter(x => x.day === d) })).filter(g => g.items.length > 0)

  return (
    <div>
      <h1>Workout Plan</h1>

      <div>
        <input
          aria-label="Exercise Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          aria-label="Sets"
          type="number"
          min={1}
          value={sets}
          onChange={e => setSets(Number(e.target.value))}
        />
        <input
          aria-label="Reps"
          type="number"
          min={1}
          value={reps}
          onChange={e => setReps(Number(e.target.value))}
        />
        <select aria-label="Day" value={day} onChange={e => setDay(e.target.value)}>
          {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <button onClick={add} disabled={!name.trim()}>Add Exercise</button>
      </div>

      {exercises.length === 0 ? (
        <p data-testid="empty-message">No exercises yet.</p>
      ) : (
        <div>
          {byDay.map(group => (
            <div key={group.day}>
              <h2>{group.day}</h2>
              <ul>
                {group.items.map(ex => (
                  <li key={ex.id} data-testid="exercise-item">
                    <span data-testid="exercise-name">{ex.name}</span>
                    <span data-testid="exercise-sets-reps">{ex.sets} × {ex.reps}</span>
                    <button onClick={() => remove(ex.id)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <p data-testid="total-count">Total exercises: {exercises.length}</p>
      <p data-testid="total-sets">Total sets: {totalSets}</p>
    </div>
  )
}
