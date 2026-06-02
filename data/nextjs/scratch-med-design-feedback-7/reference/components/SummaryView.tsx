'use client'
import { useApp } from '../hooks/useApp'

export function SummaryView() {
  const { items } = useApp()
  const total = items.length
  const open = items.filter((i) => i.status === 'open').length
  const addressed = items.filter((i) => i.status === 'addressed').length
  const pct = total === 0 ? 0 : Math.round((addressed / total) * 100)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Open: ${open}`}</p>
      <p>{`Addressed: ${addressed}`}</p>
      <p>{`Addressed rate: ${pct}%`}</p>
    </section>
  )
}
