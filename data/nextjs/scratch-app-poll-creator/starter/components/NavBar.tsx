'use client'
import React from 'react'
import { useApp } from './AppStateProvider'
import { Route } from '../lib/types'
export function NavBar() {
  const { navigate } = useApp()
  const links: { label: string; route: Route }[] = [{ label: 'Home', route: 'home' }, { label: 'Polls', route: 'polls' }, { label: 'Vote', route: 'vote' }, { label: 'Results', route: 'results' }]
  return <nav data-testid="navbar">{links.map(l => <button key={l.route} data-testid={`nav-${l.route}`} onClick={() => navigate(l.route)}>{l.label}</button>)}</nav>
}
