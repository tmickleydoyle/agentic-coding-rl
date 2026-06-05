'use client'
import type { Task } from '../lib/types'

export default function TaskItem({
  task,
  projectName,
  onToggle,
  onRemove,
}: {
  task: Task
  projectName: string
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`task-${task.id}`} data-done={task.done ? 'true' : 'false'}>
      <span data-testid={`task-${task.id}-title`}>{task.title}</span>
      <span data-testid={`task-${task.id}-project`}>{projectName}</span>
      {task.dueDate ? (
        <span data-testid={`task-${task.id}-due`}>{task.dueDate}</span>
      ) : null}
      <button data-testid={`toggle-${task.id}`} onClick={() => onToggle(task.id)}>
        {task.done ? 'Mark active' : 'Mark done'}
      </button>
      <button data-testid={`remove-${task.id}`} onClick={() => onRemove(task.id)}>
        Delete
      </button>
    </li>
  )
}
