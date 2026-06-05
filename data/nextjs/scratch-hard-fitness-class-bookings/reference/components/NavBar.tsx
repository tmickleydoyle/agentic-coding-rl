'use client'
import { useStudio } from '../hooks/useStudio'
import type { Route } from '../lib/types'

const LINKS: [Route, string][] = [
  ['classes', 'Classes'],
  ['bookings', 'Bookings'],
  ['roster', 'Roster'],
  ['settings', 'Settings'],
]

export function NavBar() {
  const { route, navigate } = useStudio()
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
