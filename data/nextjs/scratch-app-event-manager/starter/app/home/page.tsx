'use client'
import React from 'react'

export function HomePage() {
  return (
    <div>
      <h1>Event Dashboard</h1>
      <div data-testid="stat-total-events">0</div>
      <div data-testid="stat-total-attendees">0</div>
      <div data-testid="stat-upcoming-events">0</div>
      <div data-testid="stat-total-sessions">0</div>
    </div>
  )
}
