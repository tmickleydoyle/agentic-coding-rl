'use client'
import { useState } from 'react'

export default function App() {
  const [_placeholder] = useState(null)
  return (
    <div>
      <h1>Changelog</h1>
      <div data-testid="placeholder" />
    </div>
  )
}
