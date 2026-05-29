'use client'
import { useState } from 'react'

export default function RangeDisplay() {
  const [v, setV] = useState(50)
  return (
    <div>
      <input
        data-testid="slider"
        type="range"
        min="0"
        max="100"
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
      />
      <span data-testid="value">{v}</span>
    </div>
  )
}
