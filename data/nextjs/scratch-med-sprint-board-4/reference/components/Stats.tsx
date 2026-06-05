'use client'
import { useApp } from '../hooks/useApp'
import type { Status } from '../lib/types'

export function Stats() {
  const { tasks } = useApp()
  const total = tasks.length
  const totalPts = tasks.reduce((s, t) => s + t.points, 0)

  const countOf = (s: Status) => tasks.filter((t) => t.status === s).length
  const ptsOf = (s: Status) => tasks.filter((t) => t.status === s).reduce((acc, t) => acc + t.points, 0)

  const pct = total === 0 ? 0 : Math.round((countOf('done') / total) * 100)

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total tasks: ${total}`}</p>
      <p>{`Total points: ${totalPts}`}</p>
      <p>{`To Do: ${countOf('todo')} tasks, ${ptsOf('todo')} pts`}</p>
      <p>{`In Progress: ${countOf('inprogress')} tasks, ${ptsOf('inprogress')} pts`}</p>
      <p>{`Done: ${countOf('done')} tasks, ${ptsOf('done')} pts`}</p>
      <p>{`Completion: ${pct}%`}</p>
    </section>
  )
}
