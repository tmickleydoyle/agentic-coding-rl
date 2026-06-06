'use client'
import { useState } from 'react'

export default function App() {
  const [_placeholder] = useState(null)

  return (
    <div>
      <h1>Weekly Meal Planner</h1>
      <div data-testid="placeholder">Meal planner coming soon</div>
    </div>
  )
}
