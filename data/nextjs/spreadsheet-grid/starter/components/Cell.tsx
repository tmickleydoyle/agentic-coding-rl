'use client'
import type { CellId } from '../lib/engine'

// TODO: render <input data-testid={`input-${id}`}> bound to raw (onChange) and
// <span data-testid={`value-${id}`}> showing the value, or '#ERR' when value is null.
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
      <input data-testid={`input-${id}`} value={raw} onChange={() => {}} />
      <span data-testid={`value-${id}`} />
    </div>
  )
}
