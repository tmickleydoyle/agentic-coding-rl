'use client'
import { useState } from 'react'

export default function RangeDisplay() {
  // TODO: controlled range 0..100, initial 50; show value in data-testid="value".
  return (
    <div>
      <input data-testid="slider" type="range" min="0" max="100" />
      <span data-testid="value">50</span>
    </div>
  )
}
