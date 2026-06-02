'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { colors } = useApp()
  const total = colors.length

  const uniqueSet = new Set<string>()
  colors.forEach((c) => uniqueSet.add(c.hex.toLowerCase()))
  const unique = uniqueSet.size

  const mostRecent = total > 0 ? colors[colors.length - 1].name : '—'

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total colors: ${total}`}</p>
      <p>{`Unique hex codes: ${unique}`}</p>
      <p>{`Most recent: ${mostRecent}`}</p>
    </section>
  )
}
