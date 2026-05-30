'use client'
import type { Quadrant, Task } from '../lib/types'
import { quadrantOf } from '../lib/types'

const MOVES: { quadrant: Quadrant; label: string }[] = [
  { quadrant: 'do', label: 'Do' },
  { quadrant: 'schedule', label: 'Schedule' },
  { quadrant: 'delegate', label: 'Delegate' },
]

export default function TaskCard({
  task,
  onMove,
  onDelete,
}: {
  task: Task
  onMove: (id: string, quadrant: Quadrant) => void
  onDelete: (id: string) => void
}) {
  const current = quadrantOf(task)
  return (
    <li data-testid={`task-${task.id}`} data-quadrant={current}>
      <span data-testid={`task-${task.id}-title`}>{task.title}</span>
      {MOVES.filter((m) => m.quadrant !== current).map((m) => (
        <button
          key={m.quadrant}
          data-testid={`${m.quadrant}-${task.id}`}
          onClick={() => onMove(task.id, m.quadrant)}
        >
          {m.label}
        </button>
      ))}
      <button data-testid={`delete-${task.id}`} onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </li>
  )
}
