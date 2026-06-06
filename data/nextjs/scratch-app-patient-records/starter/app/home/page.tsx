'use client'
import React from 'react'

export function HomePage() {
  return (
    <div>
      <h1>Patient Records Dashboard</h1>
      <p data-testid="dashboard-patient-count">0</p>
      <p data-testid="dashboard-appointment-count">0</p>
    </div>
  )
}
