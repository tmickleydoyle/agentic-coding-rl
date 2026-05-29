'use client'
import type { Board as BoardState } from './types'
import { useBoard } from '../hooks/useBoard'
import CardView from './CardView'

export default function Board({ initial }: { initial: BoardState }) {
  const { board, moveUp, moveDown, moveLeft, moveRight, counts } = useBoard(initial)

  return (
    <div>
      {board.columns.map((col) => (
        <div key={col.id} data-testid={`col-${col.id}`}>
          <h3>{col.title}</h3>
          <span data-testid={`count-${col.id}`}>{counts[col.id]}</span>
          {(board.cards[col.id] ?? []).map((card) => (
            <CardView
              key={card.id}
              card={card}
              onUp={() => moveUp(card.id)}
              onDown={() => moveDown(card.id)}
              onLeft={() => moveLeft(card.id)}
              onRight={() => moveRight(card.id)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
