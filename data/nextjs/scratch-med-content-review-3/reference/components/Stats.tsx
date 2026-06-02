'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { items } = useApp()
  const total = items.length
  const draft = items.filter((i) => i.status === 'draft').length
  const approved = items.filter((i) => i.status === 'approved').length
  const changes = items.filter((i) => i.status === 'changes').length
  const pct = total === 0 ? 0 : Math.round((approved / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total items: ${total}`}</p>
      <p>{`Draft: ${draft}`}</p>
      <p>{`Approved: ${approved}`}</p>
      <p>{`Changes requested: ${changes}`}</p>
      <p>{`Approved %: ${pct}%`}</p>
    </section>
  )
}
