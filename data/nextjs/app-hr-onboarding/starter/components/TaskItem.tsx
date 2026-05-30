'use client'
import type { OnboardTask } from '../lib/types'

export default function TaskItem({
  task,
  onToggle,
}: {
  task: OnboardTask
  onToggle: (id: string) => void
}) {
  // TODO: render <li data-testid="task-<id>" data-done="true|false"> with the label and a
  // toggle-<id> button.
  void onToggle
  return <li data-testid={`task-${task.id}`} />
}
