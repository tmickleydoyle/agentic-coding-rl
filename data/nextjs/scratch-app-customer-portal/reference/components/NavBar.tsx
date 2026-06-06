'use client'
import React from 'react'
import { useApp } from './AppStateProvider'
import { Route } from '../lib/types'

export function NavBar() {
  const { navigate } = useApp()
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#553c9a', color: 'white' }}>
      <span style={{ fontWeight: 'bold', marginRight: '1rem' }}>Customer Portal</span>
      <button data-testid="nav-home" onClick={() => navigate('home')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Home</button>
      <button data-testid="nav-tickets" onClick={() => navigate('tickets')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Tickets</button>
      <button data-testid="nav-orders" onClick={() => navigate('orders')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Orders</button>
      <button data-testid="nav-profile" onClick={() => navigate('profile')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Profile</button>
    </nav>
  )
}
