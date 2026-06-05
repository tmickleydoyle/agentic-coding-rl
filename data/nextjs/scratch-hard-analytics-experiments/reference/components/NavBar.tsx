'use client'
import { useExperiments } from '../hooks/useExperiments'
import type { Route } from '../lib/types'

const LINKS: [Route, string][] = [
  ['experiments', 'Experiments'],
  ['variants', 'Variants'],
  ['results', 'Results'],
  ['settings', 'Settings'],
]

export function NavBar() {
  const { route, navigate } = useExperiments()
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
