'use client'
import { useState } from 'react'

export default function App() {
  const [input, setInput] = useState('')

  return (
    <div>
      <h1>Habit Streaks</h1>
      <div data-testid="placeholder"></div>
    </div>
  )
}
