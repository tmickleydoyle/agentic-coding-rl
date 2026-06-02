'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { colors } = useApp()
  const mostRecent = colors.length > 0 ? colors[colors.length - 1].name : '—'
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total colors: ${colors.length}`}</p>
      <p>{`Most recent: ${mostRecent}`}</p>
      <ul>
        {colors.map((c) => (
          <li key={c.id}>
            <span>{c.name}</span>
            <span>{c.hex}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
