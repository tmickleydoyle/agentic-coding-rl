'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { tasks } = useApp()
  const total = tasks.length
  const totalPoints = tasks.reduce((sum, t) => sum + t.points, 0)
  const donePoints = tasks.filter((t) => t.status === 'done').reduce((sum, t) => sum + t.points, 0)
  const pct = totalPoints === 0 ? 0 : Math.round((donePoints / totalPoints) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total tasks: ${total}`}</p>
      <p>{`Total points: ${totalPoints}`}</p>
      <p>{`Done points: ${donePoints}`}</p>
      <p>{`Completion: ${pct}%`}</p>
    </section>
  )
}
