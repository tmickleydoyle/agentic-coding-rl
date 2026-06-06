'use client'
import React from 'react'
import { useApp } from './AppStateProvider'
export function NavBar() {
  const { setRoute } = useApp()
  return <nav><button data-testid="nav-home" onClick={()=>setRoute('home')}>Home</button><button data-testid="nav-events" onClick={()=>setRoute('events')}>Events</button><button data-testid="nav-guests" onClick={()=>setRoute('guests')}>Guests</button><button data-testid="nav-agenda" onClick={()=>setRoute('agenda')}>Agenda</button></nav>
}
