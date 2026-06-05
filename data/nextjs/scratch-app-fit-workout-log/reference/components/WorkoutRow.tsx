'use client'
import type { Workout } from '../lib/types'

function setCount(w: Workout): number {
  let n = 0
  w.exercises.forEach((le) => {
    n += le.sets.length
  })
  return n
}

export default function WorkoutRow({
  workout,
  onOpen,
  onRemove,
}: {
  workout: Workout
  onOpen: (id: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`workout-${workout.id}`}>
      <span data-testid={`workout-${workout.id}-name`}>{workout.name}</span>
      <span data-testid={`workout-${workout.id}-date`}>{workout.date}</span>
      <span data-testid={`workout-${workout.id}-sets`}>{setCount(workout)}</span>
      <button data-testid={`open-${workout.id}`} onClick={() => onOpen(workout.id)}>
        View
      </button>
      <button data-testid={`remove-${workout.id}`} onClick={() => onRemove(workout.id)}>
        Delete
      </button>
    </li>
  )
}
