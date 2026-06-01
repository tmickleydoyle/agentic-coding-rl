'use client'
import { useFinance } from '../hooks/useFinance'
import type { Route } from '../lib/types'

const LINKS: [Route, string][] = [
  ['transactions', 'Transactions'],
  ['budgets', 'Budgets'],
  ['reports', 'Reports'],
  ['settings', 'Settings'],
]

export function NavBar() {
  const { route, navigate } = useFinance()
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
