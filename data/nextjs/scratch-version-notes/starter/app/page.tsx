'use client'
import { useState } from 'react'

export default function App() {
  const [_state, _setState] = useState(null)
  return (
    <div>
      <h1 data-testid="heading">Version Notes</h1>
      <div data-testid="placeholder" />
    </div>
  )
}
