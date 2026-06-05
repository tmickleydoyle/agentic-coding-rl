'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { items } = useApp()
  const total = items.length
  const draftCount = items.filter((i) => i.status === 'draft').length
  const approvedCount = items.filter((i) => i.status === 'approved').length
  const changesCount = items.filter((i) => i.status === 'changes').length
  const pct = total === 0 ? 0 : Math.round((approvedCount / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Draft: ${draftCount}`}</p>
      <p>{`Approved: ${approvedCount}`}</p>
      <p>{`Changes: ${changesCount}`}</p>
      <p>{`Approved: ${pct}%`}</p>
    </section>
  )
}
