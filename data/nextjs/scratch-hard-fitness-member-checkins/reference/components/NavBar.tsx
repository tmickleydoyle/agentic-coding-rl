'use client'
import { useGym } from '../hooks/useGym'
import type { Route } from '../lib/types'

const LINKS: [Route, string][] = [
  ['members', 'Members'],
  ['checkins', 'Check-ins'],
  ['progress', 'Progress'],
  ['settings', 'Settings'],
]

export function NavBar() {
  const { route, navigate } = useGym()
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
