'use client'
import type { Card as CardType, ColumnIndex } from './types'
import Card from './Card'

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
  return (
    <div data-testid={`column-${index}`}>
      <h2>
        {name} (<span data-testid={`count-${index}`}>{cards.length}</span>)
      </h2>
      {cards.map((card) => (
        <Card key={card.id} card={card} column={index} onMove={onMove} />
      ))}
    </div>
  )
}
