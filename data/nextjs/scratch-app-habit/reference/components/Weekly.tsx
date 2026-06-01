'use client'
import { useHabits } from '../hooks/useHabits'
import { DAYS } from '../lib/types'

export function Weekly() {
  const { habits, toggleDay } = useHabits()
  return (
    <section aria-label="Weekly view">
      <h1>Weekly</h1>
      {habits.map((h) => (
        <section key={h.id} aria-label={h.name}>
          <h2>{h.name}</h2>
          {DAYS.map((d, di) => (
            <label key={d}>
              <input
                type="checkbox"
                aria-label={`${h.name} ${d}`}
                checked={h.days[di]}
                onChange={() => toggleDay(h.id, di)}
              />
              {d}
            </label>
          ))}
        </section>
      ))}
    </section>
  )
}
