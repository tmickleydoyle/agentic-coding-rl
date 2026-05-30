'use client'
import type { Quadrant, Task } from '../lib/types'

export default function TaskCard({
  task,
  onMove,
  onDelete,
}: {
  task: Task
  onMove: (id: string, quadrant: Quadrant) => void
  onDelete: (id: string) => void
}) {
  // TODO: render <li data-testid="task-<id>" data-quadrant> with title, do-<id>/schedule-<id>/
  // delegate-<id> move buttons (omit the one matching the task own quadrant) and delete-<id>.
  void onMove
  void onDelete
  return <li data-testid={`task-${task.id}`} />
}
