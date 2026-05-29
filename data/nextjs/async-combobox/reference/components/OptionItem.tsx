'use client'
import type { Option } from './types'

export default function OptionItem({
  option,
  active,
  onSelect,
}: {
  option: Option
  active: boolean
  onSelect: (id: string) => void
}) {
  return (
    <li
      data-testid={`opt-${option.id}`}
      aria-selected={active}
      onClick={() => onSelect(option.id)}
    >
      {option.label}
    </li>
  )
}
