'use client'
import { useGrowth } from '../hooks/useGrowth'
import { LISTS } from '../lib/types'

export function Lists() {
  const { blasts } = useGrowth()

  const rows = LISTS.map((name) => {
    const inList = blasts.filter((b) => b.list === name)
    const sent = inList.reduce((s, b) => s + b.sent, 0)
    const opens = inList.reduce((s, b) => s + b.opens, 0)
    const clicks = inList.reduce((s, b) => s + b.clicks, 0)
    return { name, count: inList.length, sent, opens, clicks }
  }).filter((r) => r.count > 0)

  return (
    <section aria-label="Lists view">
      <h1>Lists</h1>
      {rows.length === 0 && <p>No list data yet</p>}
      {rows.map((r) => {
        const openRate = r.sent > 0 ? `${Math.round((r.opens / r.sent) * 100)}%` : 'n/a'
        const ctr = r.opens > 0 ? `${Math.round((r.clicks / r.opens) * 100)}%` : 'n/a'
        return (
          <div key={r.name}>
            <span>{`${r.name}: open rate ${openRate}, CTR ${ctr}`}</span>
          </div>
        )
      })}
    </section>
  )
}
