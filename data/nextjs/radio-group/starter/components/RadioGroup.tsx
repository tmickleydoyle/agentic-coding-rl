'use client'
import { useState } from 'react'

export default function RadioGroup({ options }: { options: string[] }) {
  // TODO: track currently selected value (or null); render radios + "selected" or "none".
  return (
    <div>
      {options.map((o) => (
        <input key={o} type="radio" name="group" data-testid={`r-${o}`} />
      ))}
      <span data-testid="selected">none</span>
    </div>
  )
}
