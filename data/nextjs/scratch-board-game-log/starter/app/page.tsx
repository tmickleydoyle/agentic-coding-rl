'use client'
import { useState } from 'react'

export default function App() {
  const [_placeholder] = useState(null)
  return (
    <div>
      <h1>Board Game Log</h1>
      <div data-testid="filter-input" />
      <div data-testid="sort-date" />
      <div data-testid="sort-duration" />
      <span data-testid="session-count">0 sessions</span>
    </div>
  )
}
