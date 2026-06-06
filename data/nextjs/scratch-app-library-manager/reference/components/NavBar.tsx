'use client'
import React from 'react'
import { useApp } from './AppStateProvider'
import { Route } from '../lib/types'

export function NavBar() {
  const { navigate } = useApp()
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#1a365d', color: 'white' }}>
      <span style={{ fontWeight: 'bold', marginRight: '1rem' }}>Library Manager</span>
      <button data-testid="nav-home" onClick={() => navigate('home')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Home</button>
      <button data-testid="nav-books" onClick={() => navigate('books')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Books</button>
      <button data-testid="nav-members" onClick={() => navigate('members')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Members</button>
      <button data-testid="nav-loans" onClick={() => navigate('loans')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Loans</button>
    </nav>
  )
}
