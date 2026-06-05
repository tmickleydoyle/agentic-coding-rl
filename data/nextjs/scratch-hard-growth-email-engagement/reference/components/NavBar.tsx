'use client'
import { useGrowth } from '../hooks/useGrowth'
import type { Route } from '../lib/types'

const LINKS: [Route, string][] = [
  ['blasts', 'Blasts'],
  ['lists', 'Lists'],
  ['overview', 'Overview'],
  ['settings', 'Settings'],
]

export function NavBar() {
  const { route, navigate } = useGrowth()
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
