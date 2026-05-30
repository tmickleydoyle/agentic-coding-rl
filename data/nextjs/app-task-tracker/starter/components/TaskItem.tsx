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
  // TODO: render <li data-testid="task-<id>" data-done> with title, projectName,
  // a toggle-<id> button and a remove-<id> button.
  void projectName
  void onToggle
  void onRemove
  return <li data-testid={`task-${task.id}`} />
}
