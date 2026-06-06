'use client'
import React from 'react'
import { useApp } from './AppStateProvider'
import { Route } from '../lib/types'

export function NavBar() {
  const { navigate } = useApp()
  const links: { label: string; route: Route }[] = [
    { label: 'Home', route: 'home' },
    { label: 'Goals', route: 'goals' },
    { label: 'Budget', route: 'budget' },
    { label: 'Reports', route: 'reports' },
  ]
  return (
    <nav data-testid="navbar">
      {links.map(l => (
        <button key={l.route} data-testid={`nav-${l.route}`} onClick={() => navigate(l.route)}>
          {l.label}
        </button>
      ))}
    </nav>
  )
}
