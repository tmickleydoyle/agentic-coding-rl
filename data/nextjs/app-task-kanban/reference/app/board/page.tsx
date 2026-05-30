'use client'
import { useBoard } from '../../components/BoardProvider'
import { useColumns } from '../../hooks/useColumns'
import Column from '../../components/Column'

export default function BoardPage() {
  const { moveForward, moveBack, archiveCard, deleteCard } = useBoard()
  const { byColumn, overLimit, columns } = useColumns()
  return (
    <section data-testid="page-board">
      <h1>Board</h1>
      <div data-testid="columns">
        {columns.map((col) => (
          <Column
            key={col}
            column={col}
            cards={byColumn[col]}
            overLimit={overLimit[col]}
            onForward={moveForward}
            onBack={moveBack}
            onArchive={archiveCard}
            onDelete={deleteCard}
          />
        ))}
      </div>
    </section>
  )
}
