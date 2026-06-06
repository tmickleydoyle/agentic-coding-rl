'use client'
import { useState } from 'react'

export default function ToggleSwitch() {
  const [on, setOn] = useState(false)

  return (
    <div>
      <button
        data-testid="toggle"
        role="switch"
        aria-checked={on}
        onClick={() => setOn(v => !v)}
        style={{
          width: 56,
          height: 28,
          borderRadius: 14,
          border: 'none',
          cursor: 'pointer',
          background: on ? '#22c55e' : '#d1d5db',
        }}
      >
        {on ? 'ON' : 'OFF'}
      </button>
      <span data-testid="toggle-label">{on ? 'ON' : 'OFF'}</span>
    </div>
  )
}
