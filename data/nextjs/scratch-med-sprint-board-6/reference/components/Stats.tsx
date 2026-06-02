'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { tasks } = useApp()
  const total = tasks.length
  const totalPts = tasks.reduce((acc, t) => acc + t.points, 0)
  const doneTasks = tasks.filter((t) => t.status === 'done')
  const donePts = doneTasks.reduce((acc, t) => acc + t.points, 0)
  const pct = totalPts === 0 ? 0 : Math.round((donePts / totalPts) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total tasks: ${total}`}</p>
      <p>{`Total points: ${totalPts}`}</p>
      <p>{`Done: ${doneTasks.length} tasks`}</p>
      <p>{`Done points: ${donePts}`}</p>
      <p>{`Progress: ${pct}%`}</p>
    </section>
  )
}
