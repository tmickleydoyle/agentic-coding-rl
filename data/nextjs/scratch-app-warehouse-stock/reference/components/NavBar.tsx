'use client'
import React from 'react'
import { useApp } from './AppStateProvider'
import { Route } from '../lib/types'

export function NavBar() {
  const { navigate } = useApp()
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#744210', color: 'white' }}>
      <span style={{ fontWeight: 'bold', marginRight: '1rem' }}>Warehouse Stock</span>
      <button data-testid="nav-home" onClick={() => navigate('home')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Home</button>
      <button data-testid="nav-inventory" onClick={() => navigate('inventory')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Inventory</button>
      <button data-testid="nav-locations" onClick={() => navigate('locations')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Locations</button>
      <button data-testid="nav-movements" onClick={() => navigate('movements')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Movements</button>
    </nav>
  )
}
