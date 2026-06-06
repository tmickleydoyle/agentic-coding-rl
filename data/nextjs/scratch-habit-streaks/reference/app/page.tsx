'use client'
import { useState } from 'react'

interface Habit {
  id: number
  name: string
  streak: number
  completedToday: boolean
}

const SEED: Habit[] = [
  { id: 1, name: 'Morning Run', streak: 5, completedToday: false },
  { id: 2, name: 'Read 30 Minutes', streak: 3, completedToday: true },
  { id: 3, name: 'Drink Water', streak: 12, completedToday: false },
]

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(SEED.map(h => ({ ...h })))
  const [input, setInput] = useState('')

  function addHabit() {
    if (!input.trim()) return
    setHabits(hs => [
      ...hs,
      { id: Date.now(), name: input.trim(), streak: 0, completedToday: false },
    ])
    setInput('')
  }

  function complete(id: number) {
    setHabits(hs =>
      hs.map(h =>
        h.id === id && !h.completedToday
          ? { ...h, completedToday: true, streak: h.streak + 1 }
          : h
      )
    )
  }

  const completedCount = habits.filter(h => h.completedToday).length

  return (
    <div>
      <h1>Habit Streaks</h1>
      <p data-testid="habit-count">Habits: {habits.length}</p>
      <p data-testid="completed-today">Completed today: {completedCount}</p>
      <ul>
        {habits.map(h => (
          <li key={h.id} data-testid="habit-item">
            <span>{h.name}</span>
            <span data-testid="streak-count">{h.streak} days</span>
            <button onClick={() => complete(h.id)} disabled={h.completedToday}>
              {h.completedToday ? 'Done' : 'Complete'}
            </button>
          </li>
        ))}
      </ul>
      <input
        aria-label="New habit name"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button onClick={addHabit}>Add Habit</button>
    </div>
  )
}
