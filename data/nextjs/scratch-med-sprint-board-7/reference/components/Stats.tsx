'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { tasks } = useApp()
  const total = tasks.length
  const totalPoints = tasks.reduce((s, t) => s + t.points, 0)
  const pointsDone = tasks.filter((t) => t.status === 'done').reduce((s, t) => s + t.points, 0)
  const pointsRemaining = totalPoints - pointsDone
  const pct = totalPoints === 0 ? 0 : Math.round((pointsDone / totalPoints) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total tasks: ${total}`}</p>
      <p>{`Total points: ${totalPoints}`}</p>
      <p>{`Points done: ${pointsDone}`}</p>
      <p>{`Points remaining: ${pointsRemaining}`}</p>
      <p>{`Progress: ${pct}%`}</p>
    </section>
  )
}
