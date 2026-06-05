'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { colors } = useApp()
  const total = colors.length
  const lowerHexes = colors.map((c) => c.hex.toLowerCase())
  const uniqueSet = new Set(lowerHexes)
  const unique = uniqueSet.size
  const duplicates = total - unique
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total colors: ${total}`}</p>
      <p>{`Unique hex codes: ${unique}`}</p>
      <p>{`Duplicates: ${duplicates}`}</p>
    </section>
  )
}
