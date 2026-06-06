'use client'
import React from 'react'
import { useApp } from './AppStateProvider'
import { Route } from '../lib/types'

export function NavBar() {
  const { navigate } = useApp()
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#2c5282', color: 'white' }}>
      <span style={{ fontWeight: 'bold', marginRight: '1rem' }}>Order Tracker</span>
      <button data-testid="nav-home" onClick={() => navigate('home')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Home</button>
      <button data-testid="nav-orders" onClick={() => navigate('orders')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Orders</button>
      <button data-testid="nav-shipments" onClick={() => navigate('shipments')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Shipments</button>
      <button data-testid="nav-returns" onClick={() => navigate('returns')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Returns</button>
    </nav>
  )
}
