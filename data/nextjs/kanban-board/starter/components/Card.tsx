'use client'
import type { Card as CardType, ColumnIndex } from './types'

// TODO: render <div data-testid="card-<id>"> with the title, a Back button
// (data-testid="back-<id>", disabled when column===0) and a Forward button
// (data-testid="forward-<id>", disabled when column===2). Back calls onMove(id, -1),
// Forward calls onMove(id, 1).
export default function Card({
  card,
  column,
  onMove,
}: {
  card: CardType
  column: ColumnIndex
  onMove: (id: number, dir: -1 | 1) => void
}) {
  return <div data-testid={`card-${card.id}`}>{card.title}</div>
}
