'use client'
import React from 'react'

export function HomePage() {
  return (
    <div>
      <h1>My Dashboard</h1>
      <div data-testid="stat-open-tickets">0</div>
      <div data-testid="stat-total-orders">0</div>
      <div data-testid="stat-resolved-tickets">0</div>
      <div data-testid="stat-pending-orders">0</div>
    </div>
  )
}
