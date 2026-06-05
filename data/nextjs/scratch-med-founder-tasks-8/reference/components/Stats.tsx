'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { tasks } = useApp()
  const total = tasks.length
  const done = tasks.filter((t) => t.done).length
  const remaining = total - done
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const countP = (p: string) => tasks.filter((t) => t.priority === p).length
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Done: ${done}`}</p>
      <p>{`Remaining: ${remaining}`}</p>
      <p>{`Done: ${pct}%`}</p>
      <p>{`High: ${countP('high')}`}</p>
      <p>{`Med: ${countP('med')}`}</p>
      <p>{`Low: ${countP('low')}`}</p>
    </section>
  )
}
