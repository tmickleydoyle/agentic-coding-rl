'use client'
import type { Habit } from '../lib/types'

export default function HabitRow({
  habit,
  done,
  onToggle,
}: {
  habit: Habit
  done: boolean
  onToggle: (id: string) => void
}) {
  // TODO: render the name, data-done flag, and a toggle-<id> button ("Undo"/"Done").
  void done
  void onToggle
  return <li data-testid={`habit-${habit.id}`} data-done="false" />
}
