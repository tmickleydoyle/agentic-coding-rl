'use client'
import { useApp } from '../hooks/useApp'
import type { Priority } from '../lib/types'

const PRIORITIES: Priority[] = ['High', 'Medium', 'Low']

export function Stats() {
  const { tasks } = useApp()
  const total = tasks.length
  const done = tasks.filter((t) => t.done).length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const count = (p: Priority) => tasks.filter((t) => t.priority === p).length

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`High: ${count('High')}`}</p>
      <p>{`Medium: ${count('Medium')}`}</p>
      <p>{`Low: ${count('Low')}`}</p>
      <p>{`Done: ${done}`}</p>
      <p>{`Completion: ${pct}%`}</p>
    </section>
  )
}
