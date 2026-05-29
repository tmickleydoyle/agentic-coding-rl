'use client'
import type { Option } from './types'

// TODO: render <span data-testid="chip-<id>"> with the label and a
// <button data-testid="remove-<id>">x</button> that calls onRemove(id).
export default function Chip({
  option,
  onRemove,
}: {
  option: Option
  onRemove: (id: string) => void
}) {
  return <span data-testid={`chip-${option.id}`}>{option.label}</span>
}
