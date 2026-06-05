'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { colors } = useApp()
  const total = colors.length

  const lightCount = colors.filter((c) => {
    const first = c.hex[1] || ''
    return /[a-fA-F]/.test(first)
  }).length

  const darkCount = colors.filter((c) => {
    const first = c.hex[1] || ''
    return /[0-9]/.test(first)
  }).length

  const mostRecent = colors.length > 0 ? colors[colors.length - 1].name : '—'

  return (
    <section aria-label="Stats view">
      <h1>Color Stats</h1>
      <p>{`Total colors: ${total}`}</p>
      <p>{`With light hue (starts #A–#F): ${lightCount}`}</p>
      <p>{`With dark hue (starts #0–#9): ${darkCount}`}</p>
      <p>{`Most recent: ${mostRecent}`}</p>
    </section>
  )
}
