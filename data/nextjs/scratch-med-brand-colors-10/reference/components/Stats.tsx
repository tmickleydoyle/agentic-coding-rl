'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { colors } = useApp()
  const total = colors.length
  const uniqueHues = (() => {
    const seen = new Set<string>()
    colors.forEach((c) => seen.add(c.hex.toLowerCase()))
    return seen.size
  })()
  const mostRecent = colors.length > 0 ? colors[colors.length - 1].name : '—'
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total colors: ${total}`}</p>
      <p>{`Unique hues: ${uniqueHues}`}</p>
      <p>{`Most recent: ${mostRecent}`}</p>
    </section>
  )
}
