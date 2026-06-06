'use client'
import React from 'react'
import { useApp } from './AppStateProvider'
import { Route } from '../lib/types'

export function NavBar() {
  const { navigate } = useApp()
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#1a202c', color: 'white' }}>
      <span style={{ fontWeight: 'bold', marginRight: '1rem' }}>Supplier Manager</span>
      <button data-testid="nav-home" onClick={() => navigate('home')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Home</button>
      <button data-testid="nav-suppliers" onClick={() => navigate('suppliers')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Suppliers</button>
      <button data-testid="nav-contacts" onClick={() => navigate('contacts')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Contacts</button>
      <button data-testid="nav-contracts" onClick={() => navigate('contracts')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Contracts</button>
    </nav>
  )
}
