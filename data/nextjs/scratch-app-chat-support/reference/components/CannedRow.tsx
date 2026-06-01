'use client'
import type { Canned } from '../lib/types'

export default function CannedRow({
  canned,
  disabled,
  onUse,
}: {
  canned: Canned
  disabled: boolean
  onUse: (text: string) => void
}) {
  return (
    <li data-testid={`canned-${canned.id}`}>
      <span data-testid={`canned-${canned.id}-label`}>{canned.label}</span>
      <button data-testid={`use-${canned.id}`} disabled={disabled} onClick={() => onUse(canned.text)}>
        Use
      </button>
    </li>
  )
}
