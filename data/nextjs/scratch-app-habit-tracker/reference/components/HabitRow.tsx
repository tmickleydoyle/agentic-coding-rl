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
  return (
    <li data-testid={`habit-${habit.id}`} data-done={done ? 'true' : 'false'}>
      <span data-testid={`habit-${habit.id}-name`}>{habit.name}</span>
      <button data-testid={`toggle-${habit.id}`} onClick={() => onToggle(habit.id)}>
        {done ? 'Undo' : 'Done'}
      </button>
    </li>
  )
}
