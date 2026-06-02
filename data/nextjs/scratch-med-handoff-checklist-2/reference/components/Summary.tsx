'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { items } = useApp()
  const total = items.length
  const completed = items.filter((it) => it.done).length
  const remaining = total - completed
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total items: ${total}`}</p>
      <p>{`Completed: ${completed}`}</p>
      <p>{`Remaining: ${remaining}`}</p>
      <p>{`Completion: ${pct}%`}</p>
    </section>
  )
}
