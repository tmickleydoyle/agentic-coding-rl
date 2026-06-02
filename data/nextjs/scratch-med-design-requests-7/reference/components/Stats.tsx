'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { requests } = useApp()
  const total = requests.length
  const countStatus = (s: string) => requests.filter((r) => r.status === s).length
  const highPriority = requests.filter((r) => r.priority === 'high').length
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`New: ${countStatus('new')}`}</p>
      <p>{`In-progress: ${countStatus('in-progress')}`}</p>
      <p>{`Done: ${countStatus('done')}`}</p>
      <p>{`High priority: ${highPriority}`}</p>
    </section>
  )
}
