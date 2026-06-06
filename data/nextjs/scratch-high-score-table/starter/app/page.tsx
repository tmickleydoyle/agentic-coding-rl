'use client'
import { useState } from 'react'

export default function App() {
  const [_placeholder] = useState(null)
  return (
    <div>
      <h1>High Score Table</h1>
      <input data-testid="search-input" type="text" />
      <span data-testid="score-count">0 scores</span>
    </div>
  )
}
