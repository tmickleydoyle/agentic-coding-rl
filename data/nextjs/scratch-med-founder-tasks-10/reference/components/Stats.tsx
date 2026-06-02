'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { tasks } = useApp()
  const total = tasks.length
  const done = tasks.filter((t) => t.done).length
  const notDone = total - done
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const high = tasks.filter((t) => t.priority === 'high').length
  const medium = tasks.filter((t) => t.priority === 'medium').length
  const low = tasks.filter((t) => t.priority === 'low').length
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total tasks: ${total}`}</p>
      <p>{`Done: ${done}`}</p>
      <p>{`Not done: ${notDone}`}</p>
      <p>{`Done: ${pct}%`}</p>
      <p>{`High: ${high}`}</p>
      <p>{`Medium: ${medium}`}</p>
      <p>{`Low: ${low}`}</p>
    </section>
  )
}
