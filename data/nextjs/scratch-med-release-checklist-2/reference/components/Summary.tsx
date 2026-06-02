'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { tasks } = useApp()
  const total = tasks.length
  const completed = tasks.filter((t) => t.done).length
  const remaining = total - completed
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  // Build ordered unique owners
  const ownerOrder: string[] = []
  tasks.forEach((t) => {
    if (!ownerOrder.includes(t.owner)) ownerOrder.push(t.owner)
  })

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total tasks: ${total}`}</p>
      <p>{`Completed: ${completed}`}</p>
      <p>{`Remaining: ${remaining}`}</p>
      <p>{`Completion: ${pct}%`}</p>
      <section aria-label="By Owner">
        <h2>By Owner</h2>
        {ownerOrder.map((owner) => {
          const ownerRemaining = tasks.filter((t) => t.owner === owner && !t.done).length
          return <p key={owner}>{`${owner}: ${ownerRemaining} remaining`}</p>
        })}
      </section>
    </section>
  )
}
