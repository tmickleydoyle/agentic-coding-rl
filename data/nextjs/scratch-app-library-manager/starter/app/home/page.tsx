'use client'
import React from 'react'

export function HomePage() {
  return (
    <div>
      <h1>Library Dashboard</h1>
      <div data-testid="stat-total-books">0</div>
      <div data-testid="stat-total-members">0</div>
      <div data-testid="stat-active-loans">0</div>
      <div data-testid="stat-overdue-loans">0</div>
    </div>
  )
}
