'use client'
import type { Task, TaskStatus } from '../lib/types'

export default function TaskCard({
  task,
  onAdvance,
}: {
  task: Task
  onAdvance: (id: string, status: TaskStatus) => void
}) {
  // TODO: render <li data-testid="board-task-<id>"> with the title and an advance-<id>
  // button (disabled when status is 'done') that advances the task.
  void onAdvance
  return <li data-testid={`board-task-${task.id}`} />
}
