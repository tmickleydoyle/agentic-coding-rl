'use client'
import { useState } from 'react'

export default function App() {
  const [_state, _setState] = useState(null)

  return (
    <div>
      <h1>Savings Jar</h1>
      <div data-testid="jar-list"></div>
    </div>
  )
}
