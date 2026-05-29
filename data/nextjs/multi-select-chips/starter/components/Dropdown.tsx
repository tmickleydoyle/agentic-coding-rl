'use client'
import type { Option } from './types'

// TODO: render <select data-testid="dropdown"> with a first placeholder
// <option value="">Select...</option> then one <option value={o.id}>{o.label}</option> per
// option. Choosing a real option calls onSelect(id). Keep the select's value controlled to "".
export default function Dropdown({
  options,
  onSelect,
}: {
  options: Option[]
  onSelect: (id: string) => void
}) {
  return (
    <select data-testid="dropdown" value="" onChange={() => {}}>
      <option value="">Select...</option>
    </select>
  )
}
