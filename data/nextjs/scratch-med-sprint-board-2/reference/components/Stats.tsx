'use client'
import { useApp } from '../hooks/useApp'
import type { Status } from '../lib/types'

export function Stats() {
  const { tasks } = useApp()
  const total = tasks.length
  const count = (s: Status) => tasks.filter((t) => t.status === s).length
  const pts = (s: Status) => tasks.filter((t) => t.status === s).reduce((sum, t) => sum + t.points, 0)
  const pct = total === 0 ? 0 : Math.round((count('done') / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total tasks: ${total}`}</p>
      <p>{`To Do: ${count('todo')}`}</p>
      <p>{`Doing: ${count('doing')}`}</p>
      <p>{`Done: ${count('done')}`}</p>
      <p>{`To Do points: ${pts('todo')}`}</p>
      <p>{`Doing points: ${pts('doing')}`}</p>
      <p>{`Done points: ${pts('done')}`}</p>
      <p>{`Done: ${pct}%`}</p>
    </section>
  )
}
