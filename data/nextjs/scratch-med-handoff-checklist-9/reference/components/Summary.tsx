'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { items } = useApp()
  const total = items.length
  const done = items.filter((it) => it.done).length
  const remaining = total - done
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Done: ${done}`}</p>
      <p>{`Remaining: ${remaining}`}</p>
      <p>{`Completion: ${pct}%`}</p>
    </section>
  )
}
