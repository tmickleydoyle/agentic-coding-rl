'use client'
import { useState } from 'react'

export default function RadioGroup({ options }: { options: string[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <div>
      {options.map((o) => (
        <input
          key={o}
          type="radio"
          name="group"
          data-testid={`r-${o}`}
          checked={selected === o}
          onChange={() => setSelected(o)}
        />
      ))}
      <span data-testid="selected">{selected ?? 'none'}</span>
    </div>
  )
}
