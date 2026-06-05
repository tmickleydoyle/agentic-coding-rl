'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { requests } = useApp()
  const total = requests.length
  const countNew = requests.filter((r) => r.status === 'new').length
  const countInProgress = requests.filter((r) => r.status === 'in-progress').length
  const countDone = requests.filter((r) => r.status === 'done').length
  const countHigh = requests.filter((r) => r.priority === 'high').length
  const pct = total === 0 ? 0 : Math.round((countDone / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`New: ${countNew}`}</p>
      <p>{`In Progress: ${countInProgress}`}</p>
      <p>{`Done: ${countDone}`}</p>
      <p>{`High Priority: ${countHigh}`}</p>
      <p>{`Completion: ${pct}%`}</p>
    </section>
  )
}
