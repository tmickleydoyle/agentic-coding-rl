'use client'
import type { Task } from '../lib/types'

export default function TaskRow({
  task,
  onFocus,
  onToggleDone,
  onRemove,
}: {
  task: Task
  onFocus: (id: string) => void
  onToggleDone: (id: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`task-${task.id}`} data-done={task.done ? 'true' : 'false'}>
      <span data-testid={`task-${task.id}-title`}>{task.title}</span>
      <span data-testid={`session-count-${task.id}`}>{task.sessions}</span>
      <button data-testid={`focus-${task.id}`} onClick={() => onFocus(task.id)}>
        Focus
      </button>
      <button data-testid={`done-${task.id}`} onClick={() => onToggleDone(task.id)}>
        {task.done ? 'Reopen' : 'Done'}
      </button>
      <button data-testid={`remove-${task.id}`} onClick={() => onRemove(task.id)}>
        Delete
      </button>
    </li>
  )
}
