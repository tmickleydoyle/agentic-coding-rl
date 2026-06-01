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
  return (
    <div data-testid={`routine-${routine.id}`} data-complete={complete ? 'true' : 'false'}>
      <h2 data-testid={`routine-${routine.id}-name`}>{routine.name}</h2>
      <ul data-testid={`step-list-${routine.id}`}>
        {routine.steps.map((s) => (
          <li key={s.id} data-testid={`step-${s.id}`} data-done={s.done ? 'true' : 'false'}>
            <span data-testid={`step-${s.id}-label`}>{s.label}</span>
            <button data-testid={`toggle-${s.id}`} onClick={() => onToggle(routine.id, s.id)}>
              {s.done ? 'Undo' : 'Done'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
