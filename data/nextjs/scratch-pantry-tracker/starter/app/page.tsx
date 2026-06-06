'use client'
import { useState } from 'react'

export default function App() {
  const [_placeholder] = useState(null)

  return (
    <div>
      <h1>Pantry Tracker</h1>
      <div data-testid="placeholder">Pantry tracker coming soon</div>
    </div>
  )
}
