'use client'
import { useApp } from '../hooks/useApp'
import type { Theme } from '../lib/types'

const THEME_ORDER: Theme[] = ['Bug', 'Feature', 'UX', 'Other']

export function Stats() {
  const { entries } = useApp()
  const total = entries.length
  const countByTheme = (t: Theme) => entries.filter((e) => e.theme === t).length
  const totalUpvotes = entries.reduce((sum, e) => sum + e.upvotes, 0)

  let topTheme = '—'
  if (total > 0) {
    let maxCount = -1
    for (let i = 0; i < THEME_ORDER.length; i++) {
      const c = countByTheme(THEME_ORDER[i])
      if (c > maxCount) {
        maxCount = c
        topTheme = THEME_ORDER[i]
      }
    }
  }

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total feedback: ${total}`}</p>
      {THEME_ORDER.map((t) => (
        <p key={t}>{`${t}: ${countByTheme(t)}`}</p>
      ))}
      <p>{`Total upvotes: ${totalUpvotes}`}</p>
      <p>{`Top theme: ${topTheme}`}</p>
    </section>
  )
}
