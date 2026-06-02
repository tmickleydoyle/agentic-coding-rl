'use client'
import { useApp } from '../hooks/useApp'
import type { Status } from '../lib/types'

export function Stats() {
  const { tasks } = useApp()
  const total = tasks.length
  const totalPts = tasks.reduce((s, t) => s + t.points, 0)
  const count = (s: Status) => tasks.filter((t) => t.status === s).length
  const pts = (s: Status) => tasks.filter((t) => t.status === s).reduce((a, t) => a + t.points, 0)
  const donePts = pts('done')
  const pct = totalPts === 0 ? 0 : Math.round((donePts / totalPts) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total tasks: ${total}`}</p>
      <p>{`Total points: ${totalPts}`}</p>
      <p>{`Todo: ${count('todo')} tasks, ${pts('todo')} pts`}</p>
      <p>{`Doing: ${count('doing')} tasks, ${pts('doing')} pts`}</p>
      <p>{`Done: ${count('done')} tasks, ${pts('done')} pts`}</p>
      <p>{`Completed: ${pct}%`}</p>
    </section>
  )
}
