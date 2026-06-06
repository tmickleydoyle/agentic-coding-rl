'use client'
import React from 'react'
import { useApp } from './AppStateProvider'
import { Route } from '../lib/types'

export function NavBar() {
  const { navigate } = useApp()
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#276749', color: 'white' }}>
      <span style={{ fontWeight: 'bold', marginRight: '1rem' }}>Staff Rota</span>
      <button data-testid="nav-home" onClick={() => navigate('home')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Home</button>
      <button data-testid="nav-shifts" onClick={() => navigate('shifts')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Shifts</button>
      <button data-testid="nav-staff" onClick={() => navigate('staff')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Staff</button>
      <button data-testid="nav-requests" onClick={() => navigate('requests')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Requests</button>
    </nav>
  )
}
