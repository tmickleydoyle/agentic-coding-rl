'use client'
import { useState } from 'react'

export default function ToggleSwitch() {
  return (
    <div>
      <button
        data-testid="toggle"
        role="switch"
        aria-checked={false}
      >
        OFF
      </button>
      <span data-testid="toggle-label">OFF</span>
    </div>
  )
}
