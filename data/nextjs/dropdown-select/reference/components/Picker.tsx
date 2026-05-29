'use client'
import { useState } from 'react'

export default function Picker({ options }: { options: string[] }) {
  const [value, setValue] = useState(options[0] ?? '')
  return (
    <div>
      <select
        data-testid="select"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <span data-testid="picked">{value}</span>
    </div>
  )
}
