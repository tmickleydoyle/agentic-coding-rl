'use client'
import React from 'react'
import { useApp } from './AppStateProvider'
import { Route } from '../lib/types'

export function NavBar() {
  const { navigate } = useApp()
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#2d3748', color: 'white' }}>
      <span style={{ fontWeight: 'bold', marginRight: '1rem' }}>Event Manager</span>
      <button data-testid="nav-home" onClick={() => navigate('home')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Home</button>
      <button data-testid="nav-events" onClick={() => navigate('events')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Events</button>
      <button data-testid="nav-attendees" onClick={() => navigate('attendees')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Attendees</button>
      <button data-testid="nav-schedule" onClick={() => navigate('schedule')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Schedule</button>
    </nav>
  )
}
