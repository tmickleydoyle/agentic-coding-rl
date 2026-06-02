'use client'
import { useApp } from '../hooks/useApp'
import type { Route } from '../lib/types'

export function NavBar() {
  const { route, navigate, items } = useApp()
  const openCount = items.filter((i) => i.status === 'open').length

  const links: [Route, string][] = [
    ['feedback', `Feedback (${openCount})`],
    ['summary', 'Summary'],
    ['settings', 'Settings'],
  ]

  return (
    <nav>
      {links.map(([r, label]) => (
        <button
          key={r}
          onClick={() => navigate(r)}
          aria-current={route === r ? 'page' : undefined}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}
