'use client'
import React from 'react'
import { useApp } from './AppStateProvider'
export function NavBar() {
  const { setRoute } = useApp()
  return <nav><button data-testid="nav-home" onClick={()=>setRoute('home')}>Home</button><button data-testid="nav-sprints" onClick={()=>setRoute('sprints')}>Sprints</button><button data-testid="nav-tickets" onClick={()=>setRoute('tickets')}>Tickets</button><button data-testid="nav-team" onClick={()=>setRoute('team')}>Team</button></nav>
}
