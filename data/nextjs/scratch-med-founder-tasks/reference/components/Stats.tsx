'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { tasks } = useApp()
  const total = tasks.length
  const done = tasks.filter((t) => t.done).length
  const notDone = total - done
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const countP = (p: string) => tasks.filter((t) => t.priority === p).length
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total tasks: ${total}`}</p>
      <p>{`Done: ${done}`}</p>
      <p>{`Not done: ${notDone}`}</p>
      <p>{`Done: ${pct}%`}</p>
      <p>{`High priority: ${countP('High')}`}</p>
      <p>{`Medium priority: ${countP('Medium')}`}</p>
      <p>{`Low priority: ${countP('Low')}`}</p>
    </section>
  )
}
