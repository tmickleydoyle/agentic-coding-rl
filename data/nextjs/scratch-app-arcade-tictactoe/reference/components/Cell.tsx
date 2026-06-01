'use client'
import type { Cell as CellValue } from '../lib/types'

export default function Cell({
  index,
  value,
  disabled,
  onPlay,
}: {
  index: number
  value: CellValue
  disabled: boolean
  onPlay: (index: number) => void
}) {
  return (
    <button
      data-testid={`cell-${index}`}
      disabled={disabled}
      onClick={() => onPlay(index)}
    >
      {value ?? ''}
    </button>
  )
}
