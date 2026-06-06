'use client'
import { useState } from 'react'

export default function App() {
  const [_placeholder] = useState(null)

  return (
    <div>
      <h1>Recipe Cost Calculator</h1>
      <div data-testid="placeholder">Recipe cost calculator coming soon</div>
    </div>
  )
}
