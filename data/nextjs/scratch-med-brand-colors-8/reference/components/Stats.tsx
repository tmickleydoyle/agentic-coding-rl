'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { colors } = useApp()
  const total = colors.length

  if (total === 0) {
    return (
      <section aria-label="Stats view">
        <h1>Stats</h1>
        <p>No colors added yet.</p>
      </section>
    )
  }

  const hexSet = new Set<string>()
  colors.forEach((c) => hexSet.add(c.hex))
  const uniqueHex = hexSet.size

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total colors: ${total}`}</p>
      <p>{`Unique hex codes: ${uniqueHex}`}</p>
    </section>
  )
}
