'use client'
import { useApp } from '../hooks/useApp'
import type { Theme } from '../lib/types'

const THEME_ORDER: Theme[] = ['Bug', 'Feature', 'UX', 'Other']

export function Stats() {
  const { items } = useApp()
  const total = items.length
  const totalUpvotes = items.reduce((sum, i) => sum + i.upvotes, 0)
  const mostUpvoted = items.length === 0
    ? '—'
    : items.reduce((best, i) => (i.upvotes > best.upvotes ? i : best), items[0]).note

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total feedback: ${total}`}</p>
      {THEME_ORDER.map((t) => {
        const count = items.filter((i) => i.theme === t).length
        if (count === 0) return null
        return <p key={t}>{`${t}: ${count}`}</p>
      })}
      <p>{`Most upvoted: ${mostUpvoted}`}</p>
      <p>{`Total upvotes: ${totalUpvotes}`}</p>
    </section>
  )
}
