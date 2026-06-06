'use client'
import React from 'react'

export function NavBar() {
  return (
    <nav>
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-patients">Patients</button>
      <button data-testid="nav-appointments">Appointments</button>
      <button data-testid="nav-records">Records</button>
    </nav>
  )
}
