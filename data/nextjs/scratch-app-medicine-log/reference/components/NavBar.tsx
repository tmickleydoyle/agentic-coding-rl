'use client'
import React from 'react'
import { useApp } from './AppStateProvider'

export function NavBar() {
  const { setRoute } = useApp()
  return (
    <nav>
      <button data-testid="nav-home" onClick={() => setRoute('home')}>Home</button>
      <button data-testid="nav-medicines" onClick={() => setRoute('medicines')}>Medicines</button>
      <button data-testid="nav-log" onClick={() => setRoute('log')}>Log</button>
      <button data-testid="nav-schedule" onClick={() => setRoute('schedule')}>Schedule</button>
    </nav>
  )
}
