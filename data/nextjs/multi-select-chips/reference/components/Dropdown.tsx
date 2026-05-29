'use client'
import type { Option } from './types'

export default function Dropdown({
  options,
  onSelect,
}: {
  options: Option[]
  onSelect: (id: string) => void
}) {
  return (
    <select
      data-testid="dropdown"
      value=""
      onChange={(e) => {
        if (e.target.value) onSelect(e.target.value)
      }}
    >
      <option value="">Select...</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
