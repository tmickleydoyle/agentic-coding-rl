'use client'
import type { Task, TaskStatus } from '../lib/types'

const NEXT: Record<TaskStatus, TaskStatus> = {
  todo: 'doing',
  doing: 'done',
  done: 'done',
}

export default function TaskCard({
  task,
  onAdvance,
}: {
  task: Task
  onAdvance: (id: string, status: TaskStatus) => void
}) {
  return (
    <li data-testid={`board-task-${task.id}`}>
      <span data-testid={`board-task-${task.id}-title`}>{task.title}</span>
      <button
        data-testid={`advance-${task.id}`}
        disabled={task.status === 'done'}
        onClick={() => onAdvance(task.id, NEXT[task.status])}
      >
        Advance
      </button>
    </li>
  )
}
