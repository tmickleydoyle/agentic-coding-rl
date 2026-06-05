'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { requests } = useApp()
  const total = requests.length
  const countOf = (s: string) => requests.filter((r) => r.status === s).length
  const highPriority = requests.filter((r) => r.priority === 'high').length
  const pct = total === 0 ? 0 : Math.round((countOf('done') / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`New: ${countOf('new')}`}</p>
      <p>{`In Progress: ${countOf('in-progress')}`}</p>
      <p>{`Done: ${countOf('done')}`}</p>
      <p>{`High Priority: ${highPriority}`}</p>
      <p>{`Completion: ${pct}%`}</p>
    </section>
  )
}
