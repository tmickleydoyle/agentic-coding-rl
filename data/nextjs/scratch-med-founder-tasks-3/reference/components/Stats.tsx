'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { tasks } = useApp()
  const total = tasks.length
  const done = tasks.filter((t) => t.done).length
  const pending = total - done
  const high = tasks.filter((t) => t.priority === 'High').length
  const medium = tasks.filter((t) => t.priority === 'Medium').length
  const low = tasks.filter((t) => t.priority === 'Low').length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Done: ${done}`}</p>
      <p>{`Pending: ${pending}`}</p>
      <p>{`High: ${high}`}</p>
      <p>{`Medium: ${medium}`}</p>
      <p>{`Low: ${low}`}</p>
      <p>{`Done: ${pct}%`}</p>
    </section>
  )
}
