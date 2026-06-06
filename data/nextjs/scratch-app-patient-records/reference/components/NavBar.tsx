'use client'
import React from 'react'
import { useApp } from './AppStateProvider'

export function NavBar() {
  const { setRoute } = useApp()
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#1a73e8' }}>
      <button data-testid="nav-home" onClick={() => setRoute('home')} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}>Home</button>
      <button data-testid="nav-patients" onClick={() => setRoute('patients')} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}>Patients</button>
      <button data-testid="nav-appointments" onClick={() => setRoute('appointments')} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}>Appointments</button>
      <button data-testid="nav-records" onClick={() => setRoute('records')} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}>Records</button>
    </nav>
  )
}
