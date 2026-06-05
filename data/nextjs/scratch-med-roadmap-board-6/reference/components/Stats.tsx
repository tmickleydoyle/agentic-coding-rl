'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { items } = useApp()
  const total = items.length
  const planned = items.filter((x) => x.status === 'planned').length
  const inProgress = items.filter((x) => x.status === 'in-progress').length
  const shipped = items.filter((x) => x.status === 'shipped').length
  const pct = total === 0 ? 0 : Math.round((shipped / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total items: ${total}`}</p>
      <p>{`Planned: ${planned}`}</p>
      <p>{`In Progress: ${inProgress}`}</p>
      <p>{`Shipped: ${shipped}`}</p>
      <p>{`Shipped %: ${pct}%`}</p>
    </section>
  )
}
