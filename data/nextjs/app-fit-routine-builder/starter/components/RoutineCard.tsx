'use client'
import type { Routine, Weekday } from '../lib/types'

export default function RoutineCard({
  routine,
  onAssign,
  onRemove,
}: {
  routine: Routine
  onAssign: (id: string, day: Weekday | null) => void
  onRemove: (id: string) => void
}) {
  // TODO: render name/count/day, an assign-<id> select (none + weekdays), and remove-<id>.
  void onAssign
  void onRemove
  return <li data-testid={`routine-${routine.id}`} data-day={routine.day ?? 'none'} />
}
