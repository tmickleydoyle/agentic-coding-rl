'use client'
import React from 'react'
import { useApp } from './AppStateProvider'

export function NavBar() {
  const { navigate } = useApp()
  return (
    <nav>
      <button data-testid="nav-home" onClick={() => navigate('home')}>Home</button>
      <button data-testid="nav-events" onClick={() => navigate('events')}>Events</button>
      <button data-testid="nav-attendees" onClick={() => navigate('attendees')}>Attendees</button>
      <button data-testid="nav-schedule" onClick={() => navigate('schedule')}>Schedule</button>
    </nav>
  )
}
