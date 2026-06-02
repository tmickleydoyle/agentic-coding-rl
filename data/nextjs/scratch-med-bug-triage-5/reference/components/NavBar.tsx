'use client'
import { useApp } from '../hooks/useApp'
import type { Route } from '../lib/types'

export function NavBar() {
  const { route, navigate, bugs } = useApp()
  const openCount = bugs.filter((b) => b.status === 'open').length
  const links: [Route, string][] = [
    ['bugs', `Bugs (${openCount})`],
    ['stats', 'Stats'],
    ['settings', 'Settings'],
  ]
  return (
    <nav>
      {links.map(([r, label]) => (
        <button key={r} onClick={() => navigate(r)} aria-current={route === r ? 'page' : undefined}>
          {label}
        </button>
      ))}
    </nav>
  )
}
