'use client'
import React from 'react'
import { useApp } from './AppStateProvider'
export function NavBar() {
  const { setRoute } = useApp()
  return <nav><button data-testid="nav-home" onClick={()=>setRoute('home')}>Home</button><button data-testid="nav-tasks" onClick={()=>setRoute('tasks')}>Tasks</button><button data-testid="nav-history" onClick={()=>setRoute('history')}>History</button><button data-testid="nav-rooms" onClick={()=>setRoute('rooms')}>Rooms</button></nav>
}
