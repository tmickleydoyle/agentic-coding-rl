'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { colors } = useApp()
  const total = colors.length
  const uniqueHexSet = new Set<string>()
  colors.forEach((c) => uniqueHexSet.add(c.hex.toLowerCase()))
  const uniqueHex = uniqueHexSet.size
  const mostRecent = colors.length > 0 ? colors[colors.length - 1].name : '—'
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total colors: ${total}`}</p>
      <p>{`Unique hex codes: ${uniqueHex}`}</p>
      <p>{`Most recent: ${mostRecent}`}</p>
    </section>
  )
}
