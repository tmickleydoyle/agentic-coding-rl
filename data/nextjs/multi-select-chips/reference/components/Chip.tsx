'use client'
import type { Option } from './types'

export default function Chip({
  option,
  onRemove,
}: {
  option: Option
  onRemove: (id: string) => void
}) {
  return (
    <span data-testid={`chip-${option.id}`}>
      {option.label}
      <button data-testid={`remove-${option.id}`} onClick={() => onRemove(option.id)}>
        x
      </button>
    </span>
  )
}
