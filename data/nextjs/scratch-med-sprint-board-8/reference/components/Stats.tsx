'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { tasks } = useApp()
  const total = tasks.length
  const totalPts = tasks.reduce((a, t) => a + t.points, 0)
  const doneCount = tasks.filter((t) => t.status === 'done').length
  const donePts = tasks.filter((t) => t.status === 'done').reduce((a, t) => a + t.points, 0)
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total tasks: ${total}`}</p>
      <p>{`Total points: ${totalPts}`}</p>
      <p>{`Done: ${doneCount} tasks`}</p>
      <p>{`Completion: ${pct}%`}</p>
      <p>{`Points done: ${donePts}`}</p>
    </section>
  )
}
