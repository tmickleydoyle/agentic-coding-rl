'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { items } = useApp()
  const total = items.length
  const openCount = items.filter((i) => i.status === 'open').length
  const addressedCount = items.filter((i) => i.status === 'addressed').length
  const pct = total === 0 ? 0 : Math.round((addressedCount / total) * 100)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Open: ${openCount}`}</p>
      <p>{`Addressed: ${addressedCount}`}</p>
      <p>{`Completion: ${pct}%`}</p>
    </section>
  )
}
