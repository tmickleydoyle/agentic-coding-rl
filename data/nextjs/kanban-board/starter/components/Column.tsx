'use client'
import type { Card as CardType, ColumnIndex } from './types'
import Card from './Card'

// TODO: render <div data-testid="column-<index>"> with a heading containing `name`,
// a <span data-testid="count-<index>"> showing cards.length, and one Card per card.
export default function Column({
  name,
  index,
  cards,
  onMove,
}: {
  name: string
  index: ColumnIndex
  cards: CardType[]
  onMove: (id: number, dir: -1 | 1) => void
}) {
  return <div data-testid={`column-${index}`} />
}
