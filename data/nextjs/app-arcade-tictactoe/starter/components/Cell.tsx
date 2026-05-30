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
  // TODO: render a board button showing the mark; clicking calls onPlay(index).
  void value
  void disabled
  void onPlay
  return <button data-testid={`cell-${index}`} />
}
