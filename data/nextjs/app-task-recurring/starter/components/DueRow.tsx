'use client'
import type { Task } from '../lib/types'

export default function DueRow({
  task,
  onComplete,
}: {
  task: Task
  onComplete: (id: string) => void
}) {
  // TODO: render <li data-testid="due-<id>"> with title, schedule, due-<id>-date and a
  // complete-<id> button.
  void onComplete
  return <li data-testid={`due-${task.id}`} />
}
