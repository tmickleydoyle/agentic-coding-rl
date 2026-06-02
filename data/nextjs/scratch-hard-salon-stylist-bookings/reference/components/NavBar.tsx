'use client'
import { useSalon } from '../hooks/useSalon'
import type { Route } from '../lib/types'

const LINKS: [Route, string][] = [
  ['appointments', 'Appointments'],
  ['stylists', 'Stylists'],
  ['reports', 'Reports'],
  ['settings', 'Settings'],
]

export function NavBar() {
  const { route, navigate } = useSalon()
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
