'use client'
import type { Board as BoardState } from './types'
import { useBoard } from '../hooks/useBoard'
import CardView from './CardView'

// TODO: render one <div data-testid={`col-${columnId}`}> per column (board.columns order), each with
// <span data-testid={`count-${columnId}`}>{count}</span> and a <CardView> per card in order, wiring
// the four handlers to moveUp/Down/Left/Right.
export default function Board({ initial }: { initial: BoardState }) {
  const { board } = useBoard(initial)
  return (
    <div>
      {board.columns.map((col) => (
        <div key={col.id} data-testid={`col-${col.id}`} />
      ))}
    </div>
  )
}
