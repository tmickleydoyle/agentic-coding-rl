'use client'
import type { OnboardTask } from '../lib/types'

export default function TaskItem({
  task,
  onToggle,
}: {
  task: OnboardTask
  onToggle: (id: string) => void
}) {
  return (
    <li data-testid={`task-${task.id}`} data-done={task.done ? 'true' : 'false'}>
      <span data-testid={`task-${task.id}-label`}>{task.label}</span>
      <button data-testid={`toggle-${task.id}`} onClick={() => onToggle(task.id)}>
        {task.done ? 'Undo' : 'Done'}
      </button>
    </li>
  )
}
