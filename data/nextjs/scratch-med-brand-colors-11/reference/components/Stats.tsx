'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { colors } = useApp()
  const total = colors.length

  const uniqueHexSet = new Set<string>()
  colors.forEach((c) => uniqueHexSet.add(c.hex.toLowerCase()))
  const uniqueHues = uniqueHexSet.size

  const mostRecent = colors.length > 0 ? colors[colors.length - 1].name : '—'
  const paletteComplete = total >= 5 ? 'Yes' : 'No'

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total colors: ${total}`}</p>
      <p>{`Unique hues: ${uniqueHues}`}</p>
      <p>{`Most recent: ${mostRecent}`}</p>
      <p>{`Palette complete: ${paletteComplete}`}</p>
    </section>
  )
}
