'use client'
import type { Option } from './types'

// TODO: render <li data-testid={`opt-${option.id}`}> with the label, aria-selected={active},
// calling onSelect(option.id) on click.
export default function OptionItem({
  option,
  active,
  onSelect,
}: {
  option: Option
  active: boolean
  onSelect: (id: string) => void
}) {
  return <li data-testid={`opt-${option.id}`}>{option.label}</li>
}
