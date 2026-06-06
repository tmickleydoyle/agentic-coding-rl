'use client'
import React from 'react'
import { useApp } from './AppStateProvider'

export function NavBar() {
  const { navigate } = useApp()
  return (
    <nav>
      <button data-testid="nav-home" onClick={() => navigate('home')}>Home</button>
      <button data-testid="nav-inventory" onClick={() => navigate('inventory')}>Inventory</button>
      <button data-testid="nav-locations" onClick={() => navigate('locations')}>Locations</button>
      <button data-testid="nav-movements" onClick={() => navigate('movements')}>Movements</button>
    </nav>
  )
}
