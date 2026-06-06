'use client'
import { useState } from 'react'

export default function ProgressBar() {
  return (
    <div>
      <div style={{ width: '100%', background: '#e5e7eb', borderRadius: 4, height: 20 }}>
        <div
          data-testid="progress-bar"
          style={{ width: '0%', background: '#3b82f6', height: '100%', borderRadius: 4 }}
        />
      </div>
      <span data-testid="progress-value">0%</span>
      <button data-testid="increase-btn">Increase</button>
      <button data-testid="decrease-btn">Decrease</button>
    </div>
  )
}
