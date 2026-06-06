'use client'
import React from 'react'

export function HomePage() {
  return (
    <div>
      <h1>Rota Dashboard</h1>
      <div data-testid="stat-total-staff">0</div>
      <div data-testid="stat-scheduled-shifts">0</div>
      <div data-testid="stat-pending-requests">0</div>
      <div data-testid="stat-total-hours">0</div>
    </div>
  )
}
