'use client'
import { useApp } from '../hooks/useApp'
import type { Route } from '../lib/types'

const LINKS: [Route, string][] = [
  ['appointments', 'Appointments'],
  ['summary', 'Summary'],
  ['settings', 'Settings'],
]

export function NavBar() {
  const { route, navigate } = useApp()
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
