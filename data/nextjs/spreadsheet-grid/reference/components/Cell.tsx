'use client'
import type { CellId } from '../lib/engine'

export default function Cell({
  id,
  raw,
  value,
  onChange,
}: {
  id: CellId
  raw: string
  value: number | null
  onChange: (v: string) => void
}) {
  return (
    <div>
      <input
        data-testid={`input-${id}`}
        value={raw}
        onChange={(e) => onChange(e.target.value)}
      />
      <span data-testid={`value-${id}`}>{value === null ? '#ERR' : value}</span>
    </div>
  )
}
