'use client'
import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { TODAY } from '../lib/types'

export function Today() {
  const { habits, hideCompleted, addHabit, toggleDay } = useHabits()
  const [name, setName] = useState('')
  const doneToday = habits.filter((h) => h.days[TODAY]).length
  const visible = hideCompleted ? habits.filter((h) => !h.days[TODAY]) : habits
  return (
    <section aria-label="Today view">
      <h1>Today</h1>
      <input aria-label="Habit name" value={name} onChange={(e) => setName(e.target.value)} />
      <button
        onClick={() => {
          addHabit(name)
          setName('')
        }}
      >
        Add habit
      </button>
      <p>{`Done today: ${doneToday}`}</p>
      <ul>
        {visible.map((h) => (
          <li key={h.id}>
            <label>
              <input
                type="checkbox"
                aria-label={`${h.name} today`}
                checked={h.days[TODAY]}
                onChange={() => toggleDay(h.id, TODAY)}
              />
              {h.name}
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
