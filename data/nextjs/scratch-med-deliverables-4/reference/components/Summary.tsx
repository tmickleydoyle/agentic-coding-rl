'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { items } = useApp()
  const total = items.length
  const delivered = items.filter((i) => i.status === 'delivered').length
  const pending = items.filter((i) => i.status === 'pending').length
  const pct = total === 0 ? 0 : Math.round((delivered / total) * 100)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Delivered: ${delivered}`}</p>
      <p>{`Pending: ${pending}`}</p>
      <p>{`Delivered: ${pct}%`}</p>
    </section>
  )
}
