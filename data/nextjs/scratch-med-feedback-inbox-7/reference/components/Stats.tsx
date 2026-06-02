'use client'
import { useApp } from '../hooks/useApp'
import type { Theme } from '../lib/types'

const THEMES: Theme[] = ['Bug', 'Feature', 'UX', 'Other']

export function Stats() {
  const { items } = useApp()
  const total = items.length
  const count = (t: Theme) => items.filter((i) => i.theme === t).length

  const topItem = items.length === 0
    ? 'none'
    : items.reduce((best, cur) => (cur.upvotes > best.upvotes ? cur : best)).note

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      {THEMES.map((t) => (
        <p key={t}>{`${t}: ${count(t)}`}</p>
      ))}
      <p>{`Top item: ${topItem}`}</p>
    </section>
  )
}
