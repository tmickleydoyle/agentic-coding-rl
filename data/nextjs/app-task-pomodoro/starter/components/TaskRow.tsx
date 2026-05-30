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
  // TODO: render <li data-testid="task-<id>" data-done> with the title, session-count-<id>,
  // a focus-<id> button, a done-<id> toggle, and a remove-<id> button.
  void onFocus
  void onToggleDone
  void onRemove
  return <li data-testid={`task-${task.id}`} />
}
