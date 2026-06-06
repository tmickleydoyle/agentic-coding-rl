'use client'
import { useState } from 'react'

export default function App() {
  const [_placeholder] = useState(null)
  return (
    <div>
      <h1>Puzzle Timer</h1>
      <span data-testid="attempt-count">0 attempts</span>
      <button data-testid="filter-all" aria-pressed={true}>All</button>
      <button data-testid="filter-easy" aria-pressed={false}>Easy</button>
      <button data-testid="filter-medium" aria-pressed={false}>Medium</button>
      <button data-testid="filter-hard" aria-pressed={false}>Hard</button>
    </div>
  )
}
