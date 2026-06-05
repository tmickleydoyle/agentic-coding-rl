'use client'
import { useApp } from '../hooks/useApp'
import type { Theme } from '../lib/types'

const THEMES: Theme[] = ['Bug', 'Feature', 'UX']

export function Stats() {
  const { items } = useApp()
  const total = items.length
  const totalUpvotes = items.reduce((sum, item) => sum + item.upvotes, 0)

  const countByTheme = (t: Theme) => items.filter((item) => item.theme === t).length

  let topTheme: string = 'None'
  if (total > 0) {
    let maxCount = 0
    let maxTheme: Theme | null = null
    let tied = false
    THEMES.forEach((t) => {
      const c = countByTheme(t)
      if (c > maxCount) {
        maxCount = c
        maxTheme = t
        tied = false
      } else if (c === maxCount && maxCount > 0) {
        tied = true
      }
    })
    topTheme = tied || maxTheme === null ? 'None' : maxTheme
  }

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total feedback: ${total}`}</p>
      {THEMES.map((t) => (
        <p key={t}>{`${t}: ${countByTheme(t)}`}</p>
      ))}
      <p>{`Total upvotes: ${totalUpvotes}`}</p>
      <p>{`Top theme: ${topTheme}`}</p>
    </section>
  )
}
