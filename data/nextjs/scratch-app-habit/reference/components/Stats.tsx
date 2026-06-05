'use client'
import { useHabits } from '../hooks/useHabits'
import { stats } from '../lib/types'

export function Stats() {
  const { habits } = useHabits()
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total habits: ${habits.length}`}</p>
      {habits.map((h) => {
        const s = stats(h.days)
        return (
          <section key={h.id} aria-label={h.name}>
            <h2>{h.name}</h2>
            <p>{`Current streak: ${s.cur}`}</p>
            <p>{`Longest streak: ${s.lon}`}</p>
            <p>{`Completion: ${s.pct}%`}</p>
          </section>
        )
      })}
    </section>
  )
}
