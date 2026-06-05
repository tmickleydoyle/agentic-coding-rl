'use client'
import { useHabits } from '../hooks/useHabits'
import type { Route } from '../lib/types'

const LINKS: [Route, string][] = [
  ['today', 'Today'],
  ['weekly', 'Weekly'],
  ['stats', 'Stats'],
  ['settings', 'Settings'],
]

export function NavBar() {
  const { route, navigate } = useHabits()
  return (
    <nav>
      {LINKS.map(([r, label]) => (
        <button key={r} onClick={() => navigate(r)} aria-current={route === r ? 'page' : undefined}>
          {label}
        </button>
      ))}
    </nav>
  )
}
