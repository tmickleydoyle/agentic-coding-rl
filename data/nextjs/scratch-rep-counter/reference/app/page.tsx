'use client'
import { useState } from 'react'

interface Exercise {
  id: number
  name: string
  target: number
  done: number
}

const SEED: Exercise[] = [
  { id: 1, name: 'Push-ups', target: 20, done: 0 },
  { id: 2, name: 'Sit-ups', target: 30, done: 0 },
  { id: 3, name: 'Burpees', target: 10, done: 0 },
]

let nextId = 4

export default function App() {
  const [exercises, setExercises] = useState<Exercise[]>(SEED.map(x => ({ ...x })))
  const [name, setName] = useState('')
  const [targetReps, setTargetReps] = useState(10)

  function increment(id: number) {
    setExercises(xs => xs.map(x => x.id === id && x.done < x.target ? { ...x, done: x.done + 1 } : x))
  }

  function reset(id: number) {
    setExercises(xs => xs.map(x => x.id === id ? { ...x, done: 0 } : x))
  }

  function add() {
    if (!name.trim()) return
    setExercises(xs => [...xs, { id: nextId++, name: name.trim(), target: targetReps, done: 0 }])
    setName('')
    setTargetReps(10)
  }

  const completedCount = exercises.filter(x => x.done >= x.target).length
  const totalRepsDone = exercises.reduce((sum, x) => sum + x.done, 0)

  return (
    <div>
      <h1>Rep Counter</h1>

      <div>
        {exercises.map(ex => (
          <div key={ex.id} data-testid="exercise-card">
            <span data-testid="exercise-name">{ex.name}</span>
            <span data-testid="rep-display">{ex.done} / {ex.target}</span>
            <button
              aria-label={`+ ${ex.name}`}
              onClick={() => increment(ex.id)}
              disabled={ex.done >= ex.target}
            >+</button>
            <button onClick={() => reset(ex.id)}>Reset</button>
            {ex.done >= ex.target && <span data-testid="complete-badge">Complete!</span>}
          </div>
        ))}
      </div>

      <div>
        <input
          aria-label="Exercise Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          aria-label="Target Reps"
          type="number"
          min={1}
          value={targetReps}
          onChange={e => setTargetReps(Number(e.target.value))}
        />
        <button onClick={add} disabled={!name.trim()}>Add</button>
      </div>

      <p data-testid="completed-count">Completed: {completedCount} / {exercises.length}</p>
      <p data-testid="total-reps-done">Total reps done: {totalRepsDone}</p>
    </div>
  )
}
