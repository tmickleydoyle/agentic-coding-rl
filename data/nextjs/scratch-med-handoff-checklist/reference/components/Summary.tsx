'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { items } = useApp()
  const total = items.length
  const doneCount = items.filter((i) => i.done).length
  const remaining = total - doneCount
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100)

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total items: ${total}`}</p>
      <p>{`Done: ${doneCount}`}</p>
      <p>{`Remaining: ${remaining}`}</p>
      <p>{`Completion: ${pct}%`}</p>
    </section>
  )
}
