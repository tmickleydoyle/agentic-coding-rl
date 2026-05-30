'use client'
import type { Workout } from '../lib/types'

export default function WorkoutRow({
  workout,
  onOpen,
  onRemove,
}: {
  workout: Workout
  onOpen: (id: string) => void
  onRemove: (id: string) => void
}) {
  // TODO: render the workout name/date/set-count plus open + remove buttons.
  void onOpen
  void onRemove
  return <li data-testid={`workout-${workout.id}`} />
}
