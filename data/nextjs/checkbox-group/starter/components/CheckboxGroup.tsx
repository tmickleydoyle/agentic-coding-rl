'use client'
import { useState } from 'react'

export default function CheckboxGroup({ options }: { options: string[] }) {
  // TODO: track checked set; render checkboxes with data-testid="cb-<opt>"; show count.
  return (
    <div>
      {options.map((o) => (
        <input key={o} type="checkbox" data-testid={`cb-${o}`} />
      ))}
      <span data-testid="count">0</span>
    </div>
  )
}
