'use client'
import React from 'react'
export function NavBar() {
  return <nav>
    <button data-testid="nav-home">Home</button>
    <button data-testid="nav-medicines">Medicines</button>
    <button data-testid="nav-log">Log</button>
    <button data-testid="nav-schedule">Schedule</button>
  </nav>
}
