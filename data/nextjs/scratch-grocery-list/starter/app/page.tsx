'use client'
import { useState } from 'react'

export default function App() {
  const [_placeholder] = useState(null)

  return (
    <div>
      <h1>Grocery List</h1>
      <div data-testid="placeholder">Grocery list coming soon</div>
    </div>
  )
}
