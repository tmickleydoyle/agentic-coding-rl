'use client'
import { useApp } from '../hooks/useApp'
import type { Status } from '../lib/types'

export function Stats() {
  const { tasks } = useApp()
  const total = tasks.length
  const totalPts = tasks.reduce((s, t) => s + t.points, 0)

  function count(s: Status) {
    return tasks.filter((t) => t.status === s).length
  }
  function pts(s: Status) {
    return tasks.filter((t) => t.status === s).reduce((sum, t) => sum + t.points, 0)
  }

  const pct = total === 0 ? 0 : Math.round((count('done') / total) * 100)

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total tasks: ${total}`}</p>
      <p>{`Total points: ${totalPts}`}</p>
      <p>{`Todo: ${count('todo')} tasks, ${pts('todo')} pts`}</p>
      <p>{`Doing: ${count('doing')} tasks, ${pts('doing')} pts`}</p>
      <p>{`Done: ${count('done')} tasks, ${pts('done')} pts`}</p>
      <p>{`Completion: ${pct}%`}</p>
    </section>
  )
}
