'use client'
import { useState } from 'react'

export default function App() {
  const [_dummy] = useState(null)
  return (
    <div>
      <h1>Chord Chart</h1>
      <div data-testid="placeholder">Implement the chord chart here.</div>
    </div>
  )
}
