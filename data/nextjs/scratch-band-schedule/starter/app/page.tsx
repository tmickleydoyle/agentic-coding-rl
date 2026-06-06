'use client'
import { useState } from 'react'

export default function App() {
  const [_dummy] = useState(null)
  return (
    <div>
      <h1>Band Schedule</h1>
      <div data-testid="placeholder">Implement the band schedule here.</div>
    </div>
  )
}
