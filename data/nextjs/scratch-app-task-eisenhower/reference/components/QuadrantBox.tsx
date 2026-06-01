'use client'
import type { Quadrant, Task } from '../lib/types'
import TaskCard from './TaskCard'

const LABELS: Record<Quadrant, string> = {
  do: 'Do first',
  schedule: 'Schedule',
  delegate: 'Delegate',
  delete: 'Eliminate',
}

export default function QuadrantBox({
  quadrant,
  tasks,
  onMove,
  onDelete,
}: {
  quadrant: Quadrant
  tasks: Task[]
  onMove: (id: string, quadrant: Quadrant) => void
  onDelete: (id: string) => void
}) {
  return (
    <section data-testid={`quadrant-${quadrant}`}>
      <h2>{LABELS[quadrant]}</h2>
      <span data-testid={`count-${quadrant}`}>{tasks.length}</span>
      <ul data-testid={`list-${quadrant}`}>
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} onMove={onMove} onDelete={onDelete} />
        ))}
      </ul>
    </section>
  )
}
