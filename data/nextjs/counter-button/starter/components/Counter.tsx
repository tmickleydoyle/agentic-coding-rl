'use client'
import { useState } from 'react'

export default function Counter() {
  // TODO: wire up state and the click handler so clicking the button
  // increments the count displayed at data-testid="count".
  return (
    <div>
      <span data-testid="count">0</span>
      <button>Increment</button>
    </div>
  )
}
