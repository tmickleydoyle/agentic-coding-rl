'use client'
import { useApp } from '../hooks/useApp'
import type { Theme } from '../lib/types'

const THEMES: Theme[] = ['Bug', 'Feature', 'UX', 'Other']

export function Stats() {
  const { items } = useApp()
  const total = items.length
  const countTheme = (t: Theme) => items.filter((i) => i.theme === t).length
  const topUpvotes = total === 0 ? 0 : Math.max(...items.map((i) => i.upvotes))
  const totalUpvotes = items.reduce((sum, i) => sum + i.upvotes, 0)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      {THEMES.map((t) => (
        <p key={t}>{`${t}: ${countTheme(t)}`}</p>
      ))}
      <p>{`Top upvotes: ${topUpvotes}`}</p>
      <p>{`Total upvotes: ${totalUpvotes}`}</p>
    </section>
  )
}
