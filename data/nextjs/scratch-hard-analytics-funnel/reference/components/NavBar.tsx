'use client'
import { useFunnel } from '../hooks/useFunnel'
import type { Route } from '../lib/types'

const LINKS: [Route, string][] = [
  ['funnels', 'Funnels'],
  ['steps', 'Steps'],
  ['analysis', 'Analysis'],
  ['settings', 'Settings'],
]

export function NavBar() {
  const { route, navigate } = useFunnel()
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
