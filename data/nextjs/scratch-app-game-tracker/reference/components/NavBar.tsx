'use client'
import React from 'react'
import { useApp } from './AppStateProvider'
export function NavBar() {
  const { setRoute } = useApp()
  return <nav><button data-testid="nav-home" onClick={()=>setRoute('home')}>Home</button><button data-testid="nav-games" onClick={()=>setRoute('games')}>Games</button><button data-testid="nav-sessions" onClick={()=>setRoute('sessions')}>Sessions</button><button data-testid="nav-achievements" onClick={()=>setRoute('achievements')}>Achievements</button></nav>
}
