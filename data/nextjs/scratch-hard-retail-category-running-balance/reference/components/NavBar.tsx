'use client'
import { useLedger } from '../hooks/useLedger'
import type { Route } from '../lib/types'

const LINKS: [Route, string][] = [
  ['ledger', 'Ledger'],
  ['categories', 'Categories'],
  ['report', 'Report'],
]

export function NavBar() {
  const { route, navigate } = useLedger()
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
