'use client'
import { useState } from 'react'

export default function ProgressBar() {
  const [value, setValue] = useState(0)

  const increase = () => setValue(v => Math.min(100, v + 10))
  const decrease = () => setValue(v => Math.max(0, v - 10))

  return (
    <div>
      <div style={{ width: '100%', background: '#e5e7eb', borderRadius: 4, height: 20 }}>
        <div
          data-testid="progress-bar"
          style={{ width: `${value}%`, background: '#3b82f6', height: '100%', borderRadius: 4 }}
        />
      </div>
      <span data-testid="progress-value">{value}%</span>
      <button data-testid="increase-btn" onClick={increase}>Increase</button>
      <button data-testid="decrease-btn" onClick={decrease}>Decrease</button>
    </div>
  )
}
