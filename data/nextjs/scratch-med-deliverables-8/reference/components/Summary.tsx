'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { deliverables } = useApp()
  const total = deliverables.length
  const delivered = deliverables.filter((d) => d.status === 'delivered').length
  const pending = deliverables.filter((d) => d.status === 'pending').length
  const rate = total === 0 ? 0 : Math.round((delivered / total) * 100)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Pending: ${pending}`}</p>
      <p>{`Delivered: ${delivered}`}</p>
      <p>{`Delivery rate: ${rate}%`}</p>
    </section>
  )
}
