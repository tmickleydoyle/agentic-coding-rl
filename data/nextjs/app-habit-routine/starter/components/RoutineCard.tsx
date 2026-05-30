'use client'
import type { Routine } from '../lib/types'

export default function RoutineCard({
  routine,
  complete,
  onToggle,
}: {
  routine: Routine
  complete: boolean
  onToggle: (routineId: string, stepId: string) => void
}) {
  // TODO: render the routine container (data-complete), name, and the step list with
  // toggle-<stepId> buttons.
  void complete
  void onToggle
  return <div data-testid={`routine-${routine.id}`} data-complete="false" />
}
