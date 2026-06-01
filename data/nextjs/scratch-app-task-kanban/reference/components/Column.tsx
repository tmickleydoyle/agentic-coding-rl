'use client'
import type { Card, Column as Col } from '../lib/types'
import CardItem from './CardItem'

const LABELS: Record<Col, string> = {
  backlog: 'Backlog',
  doing: 'Doing',
  done: 'Done',
}

export default function Column({
  column,
  cards,
  overLimit,
  onForward,
  onBack,
  onArchive,
  onDelete,
}: {
  column: Col
  cards: Card[]
  overLimit: boolean
  onForward: (id: string) => void
  onBack: (id: string) => void
  onArchive: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <section data-testid={`column-${column}`}>
      <h2>{LABELS[column]}</h2>
      <span data-testid={`count-${column}`}>{cards.length}</span>
      {overLimit ? (
        <p data-testid={`warning-${column}`}>Over WIP limit</p>
      ) : null}
      <ul data-testid={`list-${column}`}>
        {cards.map((c) => (
          <CardItem
            key={c.id}
            card={c}
            onForward={onForward}
            onBack={onBack}
            onArchive={onArchive}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  )
}
