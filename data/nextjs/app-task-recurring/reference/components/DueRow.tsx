'use client'
import type { Task } from '../lib/types'

export default function DueRow({
  task,
  onComplete,
}: {
  task: Task
  onComplete: (id: string) => void
}) {
  return (
    <li data-testid={`due-${task.id}`}>
      <span data-testid={`due-${task.id}-title`}>{task.title}</span>
      <span data-testid={`due-${task.id}-schedule`}>{task.schedule}</span>
      <span data-testid={`due-${task.id}-date`}>{task.nextDue}</span>
      <button data-testid={`complete-${task.id}`} onClick={() => onComplete(task.id)}>
        Complete
      </button>
    </li>
  )
}
