'use client'
import { useCrm } from '../hooks/useCrm'
import type { Route } from '../lib/types'

const LINKS: [Route, string][] = [
  ['contacts', 'Contacts'],
  ['pipeline', 'Pipeline'],
  ['reports', 'Reports'],
  ['settings', 'Settings'],
]

export function NavBar() {
  const { route, navigate } = useCrm()
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
