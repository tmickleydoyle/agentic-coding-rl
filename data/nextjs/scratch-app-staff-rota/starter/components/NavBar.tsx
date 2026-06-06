'use client'
import React from 'react'
import { useApp } from './AppStateProvider'

export function NavBar() {
  const { navigate } = useApp()
  return (
    <nav>
      <button data-testid="nav-home" onClick={() => navigate('home')}>Home</button>
      <button data-testid="nav-shifts" onClick={() => navigate('shifts')}>Shifts</button>
      <button data-testid="nav-staff" onClick={() => navigate('staff')}>Staff</button>
      <button data-testid="nav-requests" onClick={() => navigate('requests')}>Requests</button>
    </nav>
  )
}
