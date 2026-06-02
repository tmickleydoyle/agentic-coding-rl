'use client'
import { useShop } from '../hooks/useShop'
import type { Route } from '../lib/types'

const LINKS: [Route, string][] = [
  ['products', 'Products'],
  ['sales', 'Sales'],
  ['report', 'Report'],
]

export function NavBar() {
  const { route, navigate } = useShop()
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
