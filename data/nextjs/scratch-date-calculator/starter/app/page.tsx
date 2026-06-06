'use client'
import { useState } from 'react'

export default function App() {
  const [mode, setMode] = useState<'difference' | 'addsubtract'>('difference')

  return (
    <div>
      <h1>Date Calculator</h1>
      <div data-testid="diff-days">--</div>
      <div data-testid="diff-weeks">--</div>
      <div data-testid="diff-summary">--</div>
      <div data-testid="result-date">--</div>
    </div>
  )
}
