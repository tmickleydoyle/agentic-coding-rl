'use client'
import { useState } from 'react'

const COLORS = [
  { name: 'Red',    hex: '#ef4444' },
  { name: 'Green',  hex: '#22c55e' },
  { name: 'Blue',   hex: '#3b82f6' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Purple', hex: '#a855f7' },
]

export default function ColorSwatchPicker() {
  return (
    <div>
      <div data-testid="selected-color">None</div>
      <div>
        {COLORS.map(color => (
          <button
            key={color.name}
            data-testid={`swatch-${color.name}`}
            aria-pressed={false}
            style={{ backgroundColor: color.hex }}
          >
            {color.name}
          </button>
        ))}
      </div>
    </div>
  )
}
