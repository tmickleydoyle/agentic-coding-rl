'use client'
import { useApp } from '../hooks/useApp'
import type { Theme } from '../lib/types'

const ALL_THEMES: Theme[] = ['Bug', 'Feature', 'UX', 'Performance']

export function Stats() {
  const { items } = useApp()
  const total = items.length
  const totalUpvotes = items.reduce((sum, item) => sum + item.upvotes, 0)

  const countByTheme: Record<string, number> = {}
  items.forEach((item) => {
    countByTheme[item.theme] = (countByTheme[item.theme] || 0) + 1
  })

  let topTheme = 'None'
  let topCount = 0
  ALL_THEMES.forEach((t) => {
    const c = countByTheme[t] || 0
    if (c > topCount) {
      topCount = c
      topTheme = t
    }
  })
  if (total === 0) topTheme = 'None'

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total feedback: ${total}`}</p>
      <p>{`Total upvotes: ${totalUpvotes}`}</p>
      {ALL_THEMES.map((t) =>
        (countByTheme[t] || 0) > 0 ? (
          <p key={t}>{`${t}: ${countByTheme[t]}`}</p>
        ) : null,
      )}
      <p>{`Top theme: ${topTheme}`}</p>
    </section>
  )
}
