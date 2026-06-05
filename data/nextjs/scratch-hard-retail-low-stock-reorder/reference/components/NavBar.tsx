'use client'
import { useStock } from '../hooks/useStock'
import type { Route } from '../lib/types'

const LINKS: [Route, string][] = [
  ['inventory', 'Inventory'],
  ['restock', 'Restock'],
  ['report', 'Report'],
]

export function NavBar() {
  const { route, navigate } = useStock()
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
