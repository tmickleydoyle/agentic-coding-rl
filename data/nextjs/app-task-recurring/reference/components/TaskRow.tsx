'use client'
import type { Task } from '../lib/types'

export default function TaskRow({
  task,
  due,
  onRemove,
}: {
  task: Task
  due: boolean
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`task-${task.id}`} data-due={due ? 'true' : 'false'}>
      <span data-testid={`task-${task.id}-title`}>{task.title}</span>
      <span data-testid={`task-${task.id}-schedule`}>{task.schedule}</span>
      <span data-testid={`task-${task.id}-next`}>{task.nextDue}</span>
      <button data-testid={`remove-${task.id}`} onClick={() => onRemove(task.id)}>
        Delete
      </button>
    </li>
  )
}
