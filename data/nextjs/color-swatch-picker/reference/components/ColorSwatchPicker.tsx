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
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div>
      <div data-testid="selected-color">{selected ?? 'None'}</div>
      <div>
        {COLORS.map(color => (
          <button
            key={color.name}
            data-testid={`swatch-${color.name}`}
            aria-pressed={selected === color.name}
            style={{ backgroundColor: color.hex }}
            onClick={() => setSelected(color.name)}
          >
            {color.name}
          </button>
        ))}
      </div>
    </div>
  )
}
