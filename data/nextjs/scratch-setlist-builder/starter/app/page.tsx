'use client'
import { useState } from 'react'

export default function App() {
  const [_dummy] = useState(null)
  return (
    <div>
      <h1>Setlist Builder</h1>
      <div data-testid="placeholder">Implement the setlist builder here.</div>
    </div>
  )
}
