'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { items } = useApp()
  const total = items.length
  const planned = items.filter((i) => i.status === 'planned').length
  const inProgress = items.filter((i) => i.status === 'in-progress').length
  const shipped = items.filter((i) => i.status === 'shipped').length
  const pct = total === 0 ? 0 : Math.round((shipped / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total items: ${total}`}</p>
      <p>{`Planned: ${planned}`}</p>
      <p>{`In Progress: ${inProgress}`}</p>
      <p>{`Shipped: ${shipped}`}</p>
      <p>{`Ship rate: ${pct}%`}</p>
    </section>
  )
}
