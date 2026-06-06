'use client'
import { useState } from 'react'

export default function App() {
  const [customInput, setCustomInput] = useState('')

  return (
    <div>
      <h1>Focus Timer</h1>
      <div data-testid="placeholder"></div>
    </div>
  )
}
