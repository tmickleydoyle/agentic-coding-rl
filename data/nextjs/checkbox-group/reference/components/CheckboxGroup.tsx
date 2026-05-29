'use client'
import { useState } from 'react'

export default function CheckboxGroup({ options }: { options: string[] }) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const toggle = (o: string) =>
    setChecked((s) => {
      const next = new Set(s)
      if (next.has(o)) next.delete(o)
      else next.add(o)
      return next
    })
  return (
    <div>
      {options.map((o) => (
        <input
          key={o}
          type="checkbox"
          data-testid={`cb-${o}`}
          checked={checked.has(o)}
          onChange={() => toggle(o)}
        />
      ))}
      <span data-testid="count">{checked.size}</span>
    </div>
  )
}
