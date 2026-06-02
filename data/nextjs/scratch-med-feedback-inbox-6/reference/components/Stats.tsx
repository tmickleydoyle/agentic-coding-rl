'use client'
import { useApp } from '../hooks/useApp'
import type { Theme } from '../lib/types'

const THEMES: Theme[] = ['Bug', 'Feature', 'UX', 'Other']

export function Stats() {
  const { items } = useApp()
  const total = items.length
  const countFor = (t: Theme) => items.filter((i) => i.theme === t).length
  const totalUpvotes = items.reduce((sum, i) => sum + i.upvotes, 0)

  let topTheme = 'None'
  if (total > 0) {
    let max = -1
    THEMES.forEach((t) => {
      const c = countFor(t)
      if (c > max) {
        max = c
        topTheme = t
      }
    })
  }

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total feedback: ${total}`}</p>
      {THEMES.map((t) => (
        <p key={t}>{`${t}: ${countFor(t)}`}</p>
      ))}
      <p>{`Top theme: ${topTheme}`}</p>
      <p>{`Total upvotes: ${totalUpvotes}`}</p>
    </section>
  )
}
