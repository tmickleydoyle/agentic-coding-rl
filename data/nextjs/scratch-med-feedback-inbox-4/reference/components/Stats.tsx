'use client'
import { useApp } from '../hooks/useApp'
import type { Theme } from '../lib/types'

const THEMES: Theme[] = ['Bug', 'Feature', 'UX', 'Other']

export function Stats() {
  const { items } = useApp()
  const total = items.length

  const count = (t: Theme) => items.filter((i) => i.theme === t).length

  let topTheme = 'None'
  if (total > 0) {
    let best = -1
    for (let i = 0; i < THEMES.length; i++) {
      const c = count(THEMES[i])
      if (c > best) {
        best = c
        topTheme = THEMES[i]
      }
    }
  }

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      {THEMES.map((t) => (
        <p key={t}>{`${t}: ${count(t)}`}</p>
      ))}
      <p>{`Top theme: ${topTheme}`}</p>
    </section>
  )
}
