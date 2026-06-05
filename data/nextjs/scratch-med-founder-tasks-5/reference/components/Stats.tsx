'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { tasks } = useApp()
  const total = tasks.length
  const high = tasks.filter((t) => t.priority === 'high').length
  const med = tasks.filter((t) => t.priority === 'med').length
  const low = tasks.filter((t) => t.priority === 'low').length
  const done = tasks.filter((t) => t.done).length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`High: ${high}`}</p>
      <p>{`Med: ${med}`}</p>
      <p>{`Low: ${low}`}</p>
      <p>{`Done: ${done}`}</p>
      <p>{`Done %: ${pct}%`}</p>
    </section>
  )
}
