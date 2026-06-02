'use client'
import { usePlatform } from '../hooks/usePlatform'
import type { Route } from '../lib/types'

const LINKS: [Route, string][] = [
  ['incidents', 'Incidents'],
  ['board', 'Board'],
  ['sla', 'SLA'],
]

export function NavBar() {
  const { route, navigate } = usePlatform()
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
