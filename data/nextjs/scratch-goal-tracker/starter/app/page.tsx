'use client'
import { useState } from 'react'

export default function App() {
  const [titleInput, setTitleInput] = useState('')

  return (
    <div>
      <h1>Goal Tracker</h1>
      <div data-testid="placeholder"></div>
    </div>
  )
}
