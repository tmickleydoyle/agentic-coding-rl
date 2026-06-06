'use client'
import React from 'react'

export function HomePage() {
  return (
    <div data-testid="home-page">
      <h1>Finance Dashboard</h1>
      <div data-testid="total-saved">0</div>
      <div data-testid="total-target">0</div>
      <div data-testid="active-goals-count">0</div>
    </div>
  )
}
