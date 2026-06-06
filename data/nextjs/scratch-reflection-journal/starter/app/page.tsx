'use client'
import { useState } from 'react'

export default function App() {
  const [search, setSearch] = useState('')

  return (
    <div>
      <h1>Reflection Journal</h1>
      <div data-testid="placeholder"></div>
    </div>
  )
}
