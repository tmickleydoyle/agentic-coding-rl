'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { entries } = useApp()
  const total = entries.length
  const invited = entries.filter((e) => e.status === 'invited').length
  const pending = entries.filter((e) => e.status === 'pending').length
  const pct = total === 0 ? 0 : Math.round((invited / total) * 100)
  const twitter = entries.filter((e) => e.source === 'Twitter').length
  const reddit = entries.filter((e) => e.source === 'Reddit').length
  const direct = entries.filter((e) => e.source === 'Direct').length
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Pending: ${pending}`}</p>
      <p>{`Invited: ${invited}`}</p>
      <p>{`Invite rate: ${pct}%`}</p>
      <p>{`Twitter: ${twitter}`}</p>
      <p>{`Reddit: ${reddit}`}</p>
      <p>{`Direct: ${direct}`}</p>
    </section>
  )
}
