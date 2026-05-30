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
  // TODO: render <li data-testid="task-<id>" data-due> with title, task-<id>-schedule,
  // task-<id>-next and a remove-<id> button.
  void due
  void onRemove
  return <li data-testid={`task-${task.id}`} />
}
