'use client'
import type { Routine, Weekday } from '../lib/types'
import { WEEKDAYS } from '../hooks/useWeek'

export default function RoutineCard({
  routine,
  onAssign,
  onRemove,
}: {
  routine: Routine
  onAssign: (id: string, day: Weekday | null) => void
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`routine-${routine.id}`} data-day={routine.day ?? 'none'}>
      <span data-testid={`routine-${routine.id}-name`}>{routine.name}</span>
      <span data-testid={`routine-${routine.id}-count`}>{routine.exerciseIds.length}</span>
      <span data-testid={`routine-${routine.id}-day`}>{routine.day ?? 'unassigned'}</span>
      <select
        data-testid={`assign-${routine.id}`}
        value={routine.day ?? 'none'}
        onChange={(e) =>
          onAssign(routine.id, e.target.value === 'none' ? null : (e.target.value as Weekday))
        }
      >
        <option value="none">Unassigned</option>
        {WEEKDAYS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <button data-testid={`remove-${routine.id}`} onClick={() => onRemove(routine.id)}>
        Delete
      </button>
    </li>
  )
}
