'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { tasks } = useApp()
  const total = tasks.length
  const totalPts = tasks.reduce((s, t) => s + t.points, 0)
  const doneTasks = tasks.filter((t) => t.status === 'done')
  const doneCount = doneTasks.length
  const donePts = doneTasks.reduce((s, t) => s + t.points, 0)
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total tasks: ${total}`}</p>
      <p>{`Total points: ${totalPts}`}</p>
      <p>{`Done tasks: ${doneCount}`}</p>
      <p>{`Done points: ${donePts}`}</p>
      <p>{`Completion: ${pct}%`}</p>
    </section>
  )
}
